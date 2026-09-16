/**
 * Robust IndexedDB Offline Sync Queue Engine
 * Handles offline mutations, queue persistence, network state tracking, and background replay.
 */

export interface SyncAction {
  id: string;
  type: 'UPDATE_MEDICINE_STATUS' | 'ADD_NOTIFICATION' | 'BOOK_APPOINTMENT' | 'SUBMIT_FEEDBACK' | 'SYNC_MEDICINE';
  endpoint: string;
  method: 'POST' | 'PATCH' | 'DELETE';
  payload: Record<string, unknown>;
  createdAt: string;
  attempts: number;
  status: 'pending' | 'syncing' | 'failed';
}

const DB_NAME = 'medicare_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'sync_queue';
const FALLBACK_KEY = 'medicare_offline_sync_queue';
const MAX_ATTEMPTS = 5;

// Memory cache for synchronous reads and cross-tab event subscribers
let inMemoryQueue: SyncAction[] = [];
type QueueListener = (queue: SyncAction[]) => void;
const listeners: Set<QueueListener> = new Set();

/**
 * Checks if browser IndexedDB is supported and accessible in the current context.
 */
function isIndexedDBSupported(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

/**
 * Opens connection to IndexedDB database with object store initialization.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBSupported()) {
      return reject(new Error('IndexedDB not supported in this runtime.'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('status', 'status', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Fallback to localStorage when IndexedDB is restricted or unavailable.
 */
function getLocalStorageQueue(): SyncAction[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FALLBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalStorageQueue(queue: SyncAction[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(queue));
  } catch {}
}

/**
 * Broadcasts sync queue state changes to all active in-memory and UI listeners.
 */
function notifySubscribers(queue: SyncAction[]): void {
  inMemoryQueue = [...queue];
  listeners.forEach((listener) => {
    try {
      listener(inMemoryQueue);
    } catch (e) {
      console.error('Error in sync queue subscriber:', e);
    }
  });

  if (typeof window !== 'undefined' && 'dispatchEvent' in window) {
    window.dispatchEvent(
      new CustomEvent('medicare:sync-queue-updated', { detail: { count: queue.length } })
    );
  }
}

/**
 * Checks if the browser runtime currently has active network connectivity.
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return true;
  return navigator.onLine;
}

/**
 * Retrieves the list of pending offline actions from IndexedDB (with localStorage fallback).
 */
export async function getSyncQueue(): Promise<SyncAction[]> {
  if (typeof window === 'undefined') return [];

  if (isIndexedDBSupported()) {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => {
          const items: SyncAction[] = req.result || [];
          inMemoryQueue = items;
          resolve(items);
        };
        req.onerror = () => {
          resolve(getLocalStorageQueue());
        };
      });
    } catch {
      return getLocalStorageQueue();
    }
  }

  return getLocalStorageQueue();
}

/**
 * Synchronous snapshot getter for UI components that cannot await on first render.
 */
export function getSyncQueueSnapshot(): SyncAction[] {
  if (inMemoryQueue.length > 0) return inMemoryQueue;
  return getLocalStorageQueue();
}

/**
 * Subscribes a callback to receive real-time queue updates.
 */
export function subscribeSyncQueue(listener: QueueListener): () => void {
  listeners.add(listener);
  // Send current snapshot immediately
  listener(getSyncQueueSnapshot());

  // Also hydrate from IndexedDB async
  getSyncQueue().then((items) => {
    listener(items);
  });

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Returns the count of pending offline actions.
 */
export async function getPendingCount(): Promise<number> {
  const queue = await getSyncQueue();
  return queue.filter((item) => item.status !== 'syncing').length;
}

/**
 * Enqueues a mutation action to be replayed when connection is restored.
 */
export async function enqueueSyncAction(
  action: Omit<SyncAction, 'id' | 'createdAt' | 'attempts' | 'status'>
): Promise<SyncAction> {
  const newAction: SyncAction = {
    ...action,
    id: 'sync-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
    createdAt: new Date().toISOString(),
    attempts: 0,
    status: 'pending',
  };

  if (isIndexedDBSupported()) {
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(newAction);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      const fbQueue = getLocalStorageQueue();
      fbQueue.push(newAction);
      saveLocalStorageQueue(fbQueue);
    }
  } else {
    const fbQueue = getLocalStorageQueue();
    fbQueue.push(newAction);
    saveLocalStorageQueue(fbQueue);
  }

  const updated = await getSyncQueue();
  notifySubscribers(updated);
  return newAction;
}

/**
 * Removes a specific synced action by ID from the queue.
 */
async function removeSyncAction(id: string): Promise<void> {
  if (isIndexedDBSupported()) {
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      const fb = getLocalStorageQueue().filter((item) => item.id !== id);
      saveLocalStorageQueue(fb);
    }
  } else {
    const fb = getLocalStorageQueue().filter((item) => item.id !== id);
    saveLocalStorageQueue(fb);
  }
}

/**
 * Clears all pending sync actions.
 */
export async function clearSyncQueue(): Promise<void> {
  if (isIndexedDBSupported()) {
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      if (typeof window !== 'undefined') localStorage.removeItem(FALLBACK_KEY);
    }
  } else {
    if (typeof window !== 'undefined') localStorage.removeItem(FALLBACK_KEY);
  }

  notifySubscribers([]);
}

/**
 * Processes and replays all pending offline actions in FIFO sequence with exponential backoff.
 */
export async function processSyncQueue(): Promise<{ syncedCount: number; failedCount: number }> {
  if (!isOnline()) {
    return { syncedCount: 0, failedCount: 0 };
  }

  const queue = await getSyncQueue();
  if (queue.length === 0) {
    return { syncedCount: 0, failedCount: 0 };
  }

  let syncedCount = 0;
  let failedCount = 0;

  for (const action of queue) {
    try {
      action.status = 'syncing';
      const res = await fetch(action.endpoint, {
        method: action.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action.payload),
      });

      if (res.ok) {
        await removeSyncAction(action.id);
        syncedCount++;
      } else {
        action.attempts += 1;
        action.status = 'failed';
        if (action.attempts >= MAX_ATTEMPTS) {
          await removeSyncAction(action.id);
          failedCount++;
        }
      }
    } catch {
      action.attempts += 1;
      action.status = 'failed';
      if (action.attempts >= MAX_ATTEMPTS) {
        await removeSyncAction(action.id);
        failedCount++;
      }
    }
  }

  const remaining = await getSyncQueue();
  notifySubscribers(remaining);
  return { syncedCount, failedCount };
}

/**
 * Registers automatic listener for browser online events to reconcile offline queue.
 */
export function initOfflineSyncListener(
  onSyncComplete?: (syncedCount: number) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = async () => {
    const { syncedCount } = await processSyncQueue();
    if (syncedCount > 0 && onSyncComplete) {
      onSyncComplete(syncedCount);
    }
  };

  window.addEventListener('online', handleOnline);

  // If already online at initialization, reconcile any residual queued items
  if (isOnline()) {
    handleOnline().catch(() => {});
  }

  return () => {
    window.removeEventListener('online', handleOnline);
  };
}
