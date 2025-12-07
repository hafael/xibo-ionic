import { openDB, type DBSchema } from 'idb';

const DB_NAME = 'xibo-player-db';
const STORE_NAME = 'files';
const DB_VERSION = 1;

interface XiboPlayerDB extends DBSchema {
  [STORE_NAME]: {
    key: string;
    value: Blob;
  };
}

const dbPromise = openDB<XiboPlayerDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Create an objectStore for files if it doesn't already exist.
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME);
    }
  },
});

/**
 * Saves a file blob to the IndexedDB.
 * @param id - The unique identifier for the file (e.g., the 'saveAs' filename).
 * @param blob - The file content as a Blob.
 */
async function saveFile(id: string, blob: Blob): Promise<void> {
  const db = await dbPromise;
  await db.put(STORE_NAME, blob, id);
}

/**
 * Retrieves a file from the IndexedDB.
 * @param id - The unique identifier for the file.
 * @returns The file content as a Blob, or undefined if not found.
 */
async function getFile(id:string): Promise<Blob | undefined> {
  const db = await dbPromise;
  return db.get(STORE_NAME, id);
}

export const dbService = {
  saveFile,
  getFile,
};
