//require('dotenv').config();
let scoreHTML = document.querySelector("#score");
const scoreTextHTML = document.querySelector("#scoreText");
const scoreHistoryHTML = document.querySelector("#scoreHistory");
const secretCodeText = document.querySelector("#secretCode");
const imgReward = document.querySelector("#reward");
const search = document.querySelector("#search");
const form = document.querySelector("#form-search-img");
const score = sessionStorage.getItem("actualScore");
let seekReward = document.querySelector("#seekReward");
let img = document.createElement("img");
let db;
let scores;


async function getImage(topic, apiKey) {
    try {
        const request = await fetch(`https://api.pexels.com/v1/search?query=${topic}&per_page=1`, {
            headers: {
                Authorization: apiKey
            }
        });
        
        const response = await request.json();
        console.log(response);
        img.src=`${response.photos[0].src.landscape}`
        img.alt=`${response.photos[0].alt}>`
        img.classList.add("img-sizing");
        seekReward.append(img);
    } catch(error) {
        console.error('Error:', error);
    }
}



/*import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');
const query = 'Nature';

client.photos.search({ query, per_page: 1 }).then(photos => {});*/


scoreHTML.innerHTML = `Score : ${score.toString()}` + `${score > 0 ? ' pts' : ' pt'}`;

if (score > 0) {
    imgReward.removeAttribute("hidden");
    form.removeAttribute("hidden");
} else {

}

function handleForm(event) { 
    event.preventDefault();
    (async() => {
        getImage(search.value, "07dygd0kJLYTul8JUVlcxXEqlCJoXpf75PuKuNSFrQiKVDmmOBjAtTIO");
    })();
}

form.addEventListener('submit', handleForm);

if (!window.indexedDB) {
    console.log("Le navigateur ne supporte pas indexedDB");
}
/* **************************************
* IndexedDB pour les score et récompenses *
***************************************/

console.log("Test");
// Création de la base de données

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

const addData = async () => {
    await createDB();
    console.log(score);
    request.onsuccess = (event) => {
        db = event.target.result;
        const scoreObject = {score};
        console.log("score", scoreObject);
        const store = db.transaction("scores", "readwrite").objectStore("scores");
        store.add(scoreObject);
    };
}

const addThings = await addData();

// Récupération des scores dans la BDD
/*const getScores = async () => {
    const db = await createDB();
    const store = db.transaction("scores", "readonly").objectStore("scores");
    const request = store.getAll();
    console.log(request);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
}*/

// Ajout des scores dans la BDD
/*const setScores = async (score) => {
    return new Promise(async (resolve, reject) => {
        console.log("score", score);
        const db = await createDB();
        const store = db.transaction("scores", "readwrite").objectStore("scores");
        store.add(score);

        transaction.oncomplete = (event) => {
            console.log("Réussite de la transaction");
        };

        transaction.onerror = (event) => {
            console.log("Erreur");
        }

        transaction.onabort = (event) => {
            console.log("Transaction avortée");
        }

        request.onsuccess = (event) => {
            console.log("Réussite")
            resolve();
        };
        request.onerror = () => {
            console.log(Erreur);
            reject(request.error);
        }
    })
}*/

