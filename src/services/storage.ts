import SparkMD5 from 'spark-md5';
import { useDownloadStore, type QueuedFile } from '@/stores/download';
import { dbService } from './db';
import { XMLParser } from 'fast-xml-parser';

/**
 * Calculates the MD5 hash of a Blob by reading it in chunks.
 * @param blob - The file blob to hash.
 * @returns A promise that resolves with the MD5 hash string.
 */
function calculateMD5(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunkSize = 2097152; // 2MB chunks
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    let cursor = 0;

    fileReader.onerror = () => {
      reject(new Error('MD5 calculation failed: File could not be read.'));
    };

    fileReader.onload = (e) => {
      if (e.target?.result) {
        spark.append(e.target.result as ArrayBuffer);
        cursor += (e.target.result as ArrayBuffer).byteLength;

        if (cursor < blob.size) {
          readNextChunk();
        } else {
          resolve(spark.end());
        }
      }
    };

    const readNextChunk = () => {
      const slice = blob.slice(cursor, Math.min(cursor + chunkSize, blob.size));
      fileReader.readAsArrayBuffer(slice);
    };

    readNextChunk();
  });
}


/**
 * Downloads a file, verifies its MD5 checksum, and saves it to IndexedDB.
 * It rewrites the URL to use a local proxy to bypass CORS issues in development.
 * 
 * @param file - The file to download from the queue.
 */
async function downloadAndSaveFile(file: QueuedFile): Promise<void> {
  const originalPath = file['@_path'];
  const saveAs = file['@_saveAs'];
  const expectedMD5 = file['@_md5'];

  // Rewrite the URL to use the Vite proxy
  const url = new URL(originalPath);
  const proxiedPath = `/download-proxy${url.pathname}${url.search}`;

  console.log(`[StorageService] Starting download for: ${saveAs}`);

  const response = await fetch(proxiedPath);

  if (!response.ok) {
    throw new Error(`Failed to download file ${saveAs}. Status: ${response.status}`);
  }

  const fileBlob = await response.blob();
  
  // Verify MD5 checksum
  console.log(`[StorageService] Verifying checksum for: ${saveAs}`);
  const calculatedMD5 = await calculateMD5(fileBlob);

  if (calculatedMD5 !== expectedMD5) {
    throw new Error(`MD5 checksum mismatch for ${saveAs}. Expected: ${expectedMD5}, Got: ${calculatedMD5}`);
  }
  console.log(`[StorageService] Checksum OK for: ${saveAs}`);

  // Save the file if checksum is correct
  await dbService.saveFile(saveAs, fileBlob);
  
  // Mark the file as completed in the download queue
  const downloadStore = useDownloadStore();
  downloadStore.markAsCompleted(file);
  
  console.log(`[StorageService] Completed and saved: ${saveAs}`);
}

/**
 * Retrieves an XML file from IndexedDB and parses it into a JavaScript object.
 * @param filename - The name of the XML file to retrieve and parse.
 * @returns A promise that resolves with the parsed JavaScript object.
 */
async function getParsedLayout(filename: string): Promise<any> {
  const fileBlob = await dbService.getFile(filename);
  if (!fileBlob) {
    throw new Error(`Layout file ${filename} not found in IndexedDB.`);
  }

  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = (e) => {
      try {
        const xmlString = e.target?.result as string;
        const parser = new XMLParser({
          ignoreAttributes: false,
          textNodeName: '_text',
        });
        const parsedLayout = parser.parse(xmlString);
        resolve(parsedLayout);
      } catch (error) {
        reject(new Error(`Failed to parse XML for ${filename}: ${error}`));
      }
    };
    fileReader.onerror = () => {
      reject(new Error(`Failed to read layout file ${filename} from IndexedDB.`));
    };
    fileReader.readAsText(fileBlob);
  });
}

export const storageService = {
  downloadAndSaveFile,
  getParsedLayout,
};
