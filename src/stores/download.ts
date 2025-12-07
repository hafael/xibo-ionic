import { defineStore } from 'pinia';
import { storageService } from '@/services/storage';

// Define the structure of a file in the download queue
// Note: All properties will be prefixed with '@_' due to XML parsing.
export interface QueuedFile {
  [key: string]: any; 
}

interface DownloadState {
  queue: QueuedFile[];
  isDownloading: boolean;
  completed: QueuedFile[];
  failed: QueuedFile[];
}

export const useDownloadStore = defineStore('download', {
  state: (): DownloadState => ({
    queue: [],
    isDownloading: false,
    completed: [],
    failed: [],
  }),

  actions: {
    /**
     * Adds a list of files to the download queue, avoiding duplicates.
     * @param files - An array of file objects to add (with '@_' prefixed attributes).
     */
    addFilesToQueue(files: any[]) {
      const newFiles: QueuedFile[] = files
        .filter(file => {
          if (!file || !file['@_path']) {
            return false;
          }
          // Ensure the file has a path and is not already in the queue, completed, or failed lists
          const path = file['@_path'];
          const isNotInQueue = !this.queue.some(existing => existing['@_path'] === path);
          const isNotCompleted = !this.completed.some(existing => existing['@_path'] === path);
          const isNotFailed = !this.failed.some(existing => existing['@_path'] === path);
          return isNotInQueue && isNotCompleted && isNotFailed;
        })
        .map(fileAttr => ({ ...fileAttr })); // Create a new object from the attributes
      
      this.queue.push(...newFiles);
    },

    /**
     * Orchestrates the download queue, processing one file at a time.
     * Returns a Promise that resolves when the entire queue is processed.
     */
    async processQueue(): Promise<void> {
      // If already downloading or nothing in queue, resolve immediately.
      // This ensures only one processQueue loop runs at a time.
      if (this.isDownloading) {
        return Promise.resolve();
      }

      return new Promise<void>(async (resolve) => {
        const processNext = async () => {
          if (this.queue.length === 0) {
            this.isDownloading = false;
            resolve(); // All files processed
            return;
          }

          this.isDownloading = true;
          const fileToDownload = this.queue[0]; // Get the current file

          try {
            await storageService.downloadAndSaveFile(fileToDownload);
            // markAsCompleted action removes file from queue
          } catch (error) {
            console.error(`Failed to process file ${fileToDownload['@_saveAs']}:`, error);
            this.markAsFailed(fileToDownload); // markAsFailed action removes file from queue
          } finally {
            // Continue processing the next file in the queue
            // This is called regardless of success/failure, ensuring the loop continues.
            processNext();
          }
        };

        // Start the first download cycle
        processNext();
      });
    },

    /**
     * Moves a file from the queue to the completed list.
     * @param file - The file that has been successfully downloaded.
     */
    markAsCompleted(file: QueuedFile) {
      this.queue = this.queue.filter(f => f['@_path'] !== file['@_path']);
      this.completed.push(file);
    },

    /**
     * Moves a file from the queue to the failed list.
     * @param file - The file that failed to download.
     */
    markAsFailed(file: QueuedFile) {
      this.queue = this.queue.filter(f => f['@_path'] !== file['@_path']);
      this.failed.push(file);
    },
  },
});
