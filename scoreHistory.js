document.addEventListener("DOMContentLoaded", function() {
    let scoreList = document.querySelector("#scoreList");

    const request = window.indexedDB.open("History", 1);

    const createDB = async () => {
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            // Equivalent de "si la BDD ne contient pas de table score"
            if (!db.objectStoreNames.contains("scores")) {
                db.createObjectStore("scores", {
                    keyPath: "id",
                    autoIncrement: true
                })
            }
            /*request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);*/
        };
    }

    const getData = async () => {
        await createDB();
        request.onsuccess = (event) => {
            db = event.target.result;
            const store = db.transaction("scores", "readonly").objectStore("scores");
            const allRecords = store.getAll();
            allRecords.onsuccess = function() {
                console.log(allRecords.result);
                allRecords.result.forEach(record => {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = record["score"];
                    if (record["score"] > 0) {
                        listItem.innerHTML += " pts";
                        scoreList.append(listItem);
                    } else {
                        listItem.innerHTML += " pt";
                        scoreList.append(listItem);
                    }
                        
                });
            };
        };
    }

    getData();
});


