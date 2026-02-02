const recipeDBName = "recipiesDB";
let dbInstance: IDBDatabase | null = null;

export const RECIPE_OBJECT_STORE_NAME = "recipes";

export function openDatabase() {
  return new Promise<void>((resolve, reject) => {
    if (dbInstance) {
      resolve();
      return;
    }

    const request = indexedDB.open(recipeDBName, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      const recipeStore = db.createObjectStore(RECIPE_OBJECT_STORE_NAME, { keyPath: "id" });
      recipeStore.createIndex("title", "title", { unique: false });

      recipeStore.transaction.oncomplete = () => {
        // TODO here we execute the update logic if schema changes
      };
    };

    request.onerror = () => {
      // todo handle ver_err
      reject(request.error?.message);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve();
    };
  });
}

export function readAll<T>(storeName: string): Promise<T[]> {
  if (!dbInstance) {
    return Promise.reject("Database is not opened");
  }
  const transaction = dbInstance.transaction(storeName, "readonly");
  return new Promise<T[]>((resolve, reject) => {
    transaction.onerror = () => {
      reject(transaction.error?.message);
    };
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll();
    request.onerror = () => {
      reject(request.error?.message);
    };
    request.onsuccess = () => {
      resolve(request.result as T[]);
    };
  });
}

export function addItem<T>(storeName: string, item: T): Promise<void> {
  if (!dbInstance) {
    return Promise.reject("Database is not opened");
  }
  const transaction = dbInstance.transaction([storeName], "readwrite");
  return new Promise<void>((resolve, reject) => {
    transaction.onerror = () => {
      reject(transaction.error?.message);
    };
    transaction.oncomplete = () => {
      resolve();
    };
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.add(item);
    
    request.onerror = () => {
      reject(request.error?.message);
    };
    request.onsuccess = () => {
      resolve();
    };
  });
}

export function updateItem<T>(storeName: string, item: T): Promise<void> {
  if (!dbInstance) {
    return Promise.reject("Database is not opened");
  }
  const transaction = dbInstance.transaction(storeName, "readwrite");
  return new Promise<void>((resolve, reject) => {
    transaction.onerror = () => {
      reject(transaction.error?.message);
    };
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.put(item);
    request.onerror = () => {
      reject(request.error?.message);
    };
    request.onsuccess = () => {
      resolve();
    };
  });
}

export function deleteItem(storeName: string, key: string): Promise<void> {
  if (!dbInstance) {
    return Promise.reject("Database is not opened");
  }
  const transaction = dbInstance.transaction(storeName, "readwrite");
  return new Promise<void>((resolve, reject) => {
    transaction.onerror = () => {
      reject(transaction.error?.message);
    };
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.delete(key);
    request.onerror = () => {
      reject(request.error?.message);
    };
    request.onsuccess = () => {
      resolve();
    };
  });
}