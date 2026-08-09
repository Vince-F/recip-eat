import { Page } from "@playwright/test";

export class IndexedDbHelper {
  constructor(private readonly page: Page, private readonly dbName: string, private readonly storeName: string) {}

  cleanAllObjectStores(): Promise<void> {
    return this.page.evaluate(
      ({ dbName, storeName }: { dbName: string; storeName: string }) => {
        return new Promise<void>((resolve, reject) => {

          const request = indexedDB.open(dbName, 1);

          request.onerror = () => {
            reject(request.error?.message ?? "Failed to open database");
          };

          request.onblocked = () => {
            reject("Database opening was blocked");
          };

          request.onsuccess = () => {
            try {
              const db = request.result;
              const transaction = db.transaction(storeName, "readwrite");
              const objectStore = transaction.objectStore(storeName);

              transaction.onabort = () => {
                db.close();
                reject(transaction.error?.message ?? "Transaction aborted");
              };

              transaction.onerror = () => {
                db.close();
                reject(transaction.error?.message ?? "Transaction failed");
              };

              transaction.oncomplete = () => {
                db.close();
                resolve();
              };

              const clearRequest = objectStore.clear();

              clearRequest.onerror = () => {
                db.close();
                reject(clearRequest.error?.message ?? "Failed to clear store");
              };
            } catch (error) {
              reject(error);
            }
          };
        });
      },
      { dbName: this.dbName, storeName: this.storeName }
    );
  }

  addItem(item: unknown): Promise<void> {
    return this.page.evaluate(
      ({ dbName, storeName, item }: { dbName: string; storeName: string; item: unknown }) => {
        return new Promise<void>((resolve, reject) => {
          const resetStore = () => {
            return new Promise<void>((resetResolve, resetReject) => {
              let resetSettled = false;

              const settleReset = (callback: () => void) => {
                if (resetSettled) {
                  return;
                }
                resetSettled = true;
                callback();
              };

              const resetRejectWith = (error: unknown) => {
                settleReset(() => resetReject(error));
              };

              const resetResolveWith = () => {
                settleReset(() => resetResolve());
              };

              const request = indexedDB.open(dbName, 1);

              request.onerror = () => {
                resetRejectWith(request.error?.message ?? "Failed to open database");
              };

              request.onblocked = () => {
                resetRejectWith("Database opening was blocked");
              };

              request.onsuccess = () => {
                try {
                  const db = request.result;
                  const transaction = db.transaction(storeName, "readwrite");
                  const objectStore = transaction.objectStore(storeName);

                  transaction.onabort = () => {
                    db.close();
                    resetRejectWith(transaction.error?.message ?? "Transaction aborted");
                  };

                  transaction.onerror = () => {
                    db.close();
                    resetRejectWith(transaction.error?.message ?? "Transaction failed");
                  };

                  transaction.oncomplete = () => {
                    db.close();
                    resetResolveWith();
                  };

                  const clearRequest = objectStore.clear();

                  clearRequest.onerror = () => {
                    db.close();
                    resetRejectWith(clearRequest.error?.message ?? "Failed to clear store");
                  };
                } catch (error) {
                  resetRejectWith(error);
                }
              };
            });
          };

          resetStore()
            .then(() => {
              try {
                const request = indexedDB.open(dbName, 1);

                request.onerror = () => {
                  reject(request.error?.message ?? "Failed to open database");
                };

                request.onblocked = () => {
                  reject("Database opening was blocked");
                };

                request.onsuccess = () => {
                  try {
                    const dbInstance = request.result;
                    const transaction = dbInstance.transaction(storeName, "readwrite");
                    const store = transaction.objectStore(storeName);

                    transaction.onabort = () => {
                      dbInstance.close();
                      reject(transaction.error?.message ?? "Transaction aborted");
                    };

                    transaction.onerror = () => {
                      dbInstance.close();
                      reject(transaction.error?.message ?? "Transaction failed");
                    };

                    transaction.oncomplete = () => {
                      dbInstance.close();
                      resolve();
                    };

                    const addRequest = store.add(item);

                    addRequest.onerror = () => {
                      dbInstance.close();
                      reject(addRequest.error?.message ?? "Failed to add item");
                    };
                  } catch (error) {
                    reject(error);
                  }
                };
              } catch (error) {
                reject(error);
              }
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
      { dbName: this.dbName, storeName: this.storeName, item }
    );
  }

  addItems(items: unknown[]): Promise<void> {
    return this.page.evaluate(
      ({ dbName, storeName, items }: { dbName: string; storeName: string; items: unknown[] }) => {
        return new Promise<void>((resolve, reject) => {
          const resetStore = () => {
            return new Promise<void>((resetResolve, resetReject) => {
              let resetSettled = false;

              const settleReset = (callback: () => void) => {
                if (resetSettled) {
                  return;
                }
                resetSettled = true;
                callback();
              };

              const resetRejectWith = (error: unknown) => {
                settleReset(() => resetReject(error));
              };

              const resetResolveWith = () => {
                settleReset(() => resetResolve());
              };

              const request = indexedDB.open(dbName, 1);

              request.onerror = () => {
                resetRejectWith(request.error?.message ?? "Failed to open database");
              };

              request.onblocked = () => {
                resetRejectWith("Database opening was blocked");
              };

              request.onsuccess = () => {
                try {
                  const db = request.result;
                  const transaction = db.transaction(storeName, "readwrite");
                  const objectStore = transaction.objectStore(storeName);

                  transaction.onabort = () => {
                    db.close();
                    resetRejectWith(transaction.error?.message ?? "Transaction aborted");
                  };

                  transaction.onerror = () => {
                    db.close();
                    resetRejectWith(transaction.error?.message ?? "Transaction failed");
                  };

                  transaction.oncomplete = () => {
                    db.close();
                    resetResolveWith();
                  };

                  const clearRequest = objectStore.clear();

                  clearRequest.onerror = () => {
                    db.close();
                    resetRejectWith(clearRequest.error?.message ?? "Failed to clear store");
                  };
                } catch (error) {
                  resetRejectWith(error);
                }
              };
            });
          };

          resetStore()
            .then(() => {
              try {
                const request = indexedDB.open(dbName, 1);

                request.onerror = () => {
                  reject(request.error?.message ?? "Failed to open database");
                };

                request.onblocked = () => {
                  reject("Database opening was blocked");
                };

                request.onsuccess = () => {
                  try {
                    const dbInstance = request.result;
                    const transaction = dbInstance.transaction(storeName, "readwrite");
                    const store = transaction.objectStore(storeName);

                    transaction.onabort = () => {
                      dbInstance.close();
                      reject(transaction.error?.message ?? "Transaction aborted");
                    };

                    transaction.onerror = () => {
                      dbInstance.close();
                      reject(transaction.error?.message ?? "Transaction failed");
                    };

                    transaction.oncomplete = () => {
                      dbInstance.close();
                      resolve();
                    };

                    items.forEach((item) => {
                      store.add(item);
                    });
                  } catch (error) {
                    reject(error);
                  }
                };
              } catch (error) {
                reject(error);
              }
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
      { dbName: this.dbName, storeName: this.storeName, items }
    );
  }
}