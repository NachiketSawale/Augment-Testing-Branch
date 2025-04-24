/**
 * Convert the Uint8Array stored in the index db into 
 * @param {Uint8Array} jsonUint8Array 
 * @returns { {"timestamp" : number }}
 */
 var parseJSON = function (jsonUint8Array) {
    var textDecoder = new TextDecoder();
    var jsonStr = textDecoder.decode(jsonUint8Array);
    var json = JSON.parse(jsonStr);

    return json;
}

/**
 * Check if the cache should be expired
 * @param {number} timestamp UNIX timestamp in ms
 * @returns {boolean}
 */
var isRecordExpired = function (currentTime, timestamp) {
    var recordTime = new Date(timestamp);
    var diff = Math.abs(currentTime - recordTime);
    var minutes = Math.floor((diff / 1000) / 60);

    return minutes > 60;
}

/**
 * Open emscripten cursor, please note onsuccess will be called multiple times.
 * @param {*} onsuccess 
 */
var openEmscriptenFilesystemCursor = function(onsuccess) {
    var request = indexedDB.open("emscripten_filesystem");
    request.onerror = function (event) {
        console.error(event);
    };

    request.onsuccess = function (event) {
        /** @type {IDBDatabase} */ var db = event.target.result;
        /** @type {IDBTransaction} */ var transaction = db.transaction(['FILES'], 'readwrite');
        /** @type {IDBObjectStore} */ var objectStore = transaction.objectStore('FILES');
        var openCursorRequest = objectStore.openCursor();

        openCursorRequest.onerror = function (event) {
            console.error("error in opening the cursor");
        };

        openCursorRequest.onsuccess = function (event) {
            onsuccess(event, objectStore);
        };
    }
}

var houseKeepingFetchCache = function () {
    /** @type {string[]} */ let deleteFiles = [];

    openEmscriptenFilesystemCursor(function (event, objectStore) {
        /** @type {IDBCursorWithValue} */ let cursor = event.target.result;
        const currentTime = new Date();
        const cacheMetaFilePrefix = "cache:";
        const cacheMetaFilePrefixLength = cacheMetaFilePrefix.length;

        if (cursor) {
            /** @type {string} */ let key = cursor.primaryKey;
            /** @type {Uint8Array} */ let value = cursor.value;
            if (key.startsWith(cacheMetaFilePrefix)) {
                var json = parseJSON(value);
                if (isRecordExpired(currentTime, json.timestamp)) {
                    deleteFiles.push(key);
                    
                    const cachedFileKey = key.substring(key.indexOf(cacheMetaFilePrefix) + cacheMetaFilePrefixLength);
                    deleteFiles.push(cachedFileKey);
                }
            }

            cursor.continue();
        } else {
            // end of the cursor, we do a clean up of the record
            deleteFiles.forEach(r => {
                let deleteFileRequest = objectStore.delete(r);
                deleteFileRequest.onerror = function (event) { console.error("Failed to delete file in ", event); };
            });
        }
    });
};

var main = function () {
    try {
        houseKeepingFetchCache();
    } catch (error) {
        console.error("houseKeepingFetchCache error", error);
    }

    setTimeout(() => {
        main();
    }, 3600000);
};

main();

/**
 * Delete drawing cache of a drawing
 * @param {string} drawingId 
 */
const deleteDrawingCacheAction = function(drawingId) {
    /** @type {string[]} */ let deleteFiles = [];

    openEmscriptenFilesystemCursor(function (event, objectStore) {
        /** @type {IDBCursorWithValue} */ let cursor = event.target.result;
        const urlPattern = "drawing/" + drawingId;
        console.log("delete urlPattern", urlPattern);

        if (cursor) {
            /** @type {string} */ let key = cursor.primaryKey;
            /** @type {Uint8Array} */ let value = cursor.value;
            if (key.indexOf(urlPattern) >= 0) {
                deleteFiles.push(key);
            }

            cursor.continue();
        } else {
            deleteFiles.forEach(r => {
                let deleteFileRequest = objectStore.delete(r);
                deleteFileRequest.onerror = function (event) { console.error("Failed to delete file in ", event); };
            });
        }
    });
};

const clearAllCacheAction = function() {
    var request = indexedDB.open("emscripten_filesystem");
    request.onerror = function (event) {
        console.error(event);
    };

    request.onsuccess = function (event) {
        /** @type {IDBDatabase} */ var db = event.target.result;
        /** @type {IDBTransaction} */ var transaction = db.transaction(['FILES'], 'readwrite');
        /** @type {IDBObjectStore} */ var objectStore = transaction.objectStore('FILES');
        objectStore.clear();
    }
};

// Event sent from browser
onmessage = function(e) {
    console.log('[Worker]: Message received from main script');
    
    /** @type {{"action": "deleteDrawingCache" | "clearAllCache", "payload": { "drawingId" : string}}} */
    const data = e.data;
    const action = data.action;
    console.log('[Worker] action', action);
    if (action === "deleteDrawingCache") {
        const drawingId = data.payload.drawingId;
        deleteDrawingCacheAction(drawingId);
    }
    else if (action === "clearAllCache") {
        clearAllCacheAction();
    }
}