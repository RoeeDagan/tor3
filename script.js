// JSONBin.io Configuration - Replace these with your actual values

const JSONBIN_API_KEY = '$2a$10$EOAfjf42Qt7YDKiisdaG1uUYKrfG1YMxFSFB2KcajZo.q9dShlLXe'; // Replace with your JSONBin API key

const JSONBIN_BIN_ID = '68fd4007d0ea881f40bbb861'; // Replace with your Bin ID

 

// Test function to create a new bin - call this from console

async function createNewBin() {

    const initialData = {

        readers: ["רועי דגן", "יונה רייכמן"],

        last_readers: [],

        parasha: {

            "שמות": ["עופר", "יוסי"],

            "בראשית": ["עודד", "משה"]

        },

        parasha_name: "בראשית",

        aliyot: {},

        last_updated: new Date().toISOString()

    };

 

    try {

        const response = await fetch('https://api.jsonbin.io/v3/b', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',

                'X-Master-Key': JSONBIN_API_KEY,

                'X-Bin-Name': 'Torah Readings Data'

            },

            body: JSON.stringify(initialData)

        });

 

        if (response.ok) {

            const result = await response.json();

            console.log('New bin created successfully!');

            console.log('Your new Bin ID is:', result.metadata.id);

            console.log('Copy this ID and replace JSONBIN_BIN_ID in your script.js file');

            alert(`בין חדש נוצר בהצלחה!\nBin ID החדש שלך: ${result.metadata.id}\nהעתק את המזהה הזה והחלף את JSONBIN_BIN_ID בקובץ script.js`);

            return result.metadata.id;

        } else {

            const error = await response.text();

            console.error('Error creating bin:', error);

            alert('שגיאה ביצירת בין חדש: ' + error);

        }

    } catch (error) {

        console.error('Error:', error);

        alert('שגיאה ביצירת בין חדש: ' + error.message);

    }

}

 

// Test function to verify your API key

async function testAPIKey() {

    try {

        const response = await fetch('https://api.jsonbin.io/v3/b', {

            headers: {

                'X-Master-Key': JSONBIN_API_KEY

            }

        });

 

        if (response.ok) {

            const bins = await response.json();

            console.log('API Key is valid! Your bins:', bins);

            alert('API Key תקין! יש לך ' + bins.length + ' בינים בחשבון');

        } else {

            const error = await response.text();

            console.error('API Key test failed:', error);

            alert('API Key לא תקין: ' + error);

        }

    } catch (error) {

        console.error('Error testing API key:', error);

        alert('שגיאה בבדיקת API Key: ' + error.message);

    }

}

 

let readers = ["רועי דגן", "יונה רייכמן"];

let last_readers = [];

let parasha = {

    "שמות": ["עופר", "יוסי"],

    "בראשית": ["עודד", "משה"]

};

 

let parasha_name = "בראשית";

let aliyot_list = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שביעי"];

 

document.addEventListener("DOMContentLoaded", function() {

    populateAllDropdowns();

    document.getElementById("clear-btn").addEventListener("click", clearFunc);

    document.getElementById("history-btn").addEventListener("click", openHistoryListModal);

    document.getElementById("readers-list-btn").addEventListener("click", openReadersListModal);

    document.getElementById("archive-btn").addEventListener("click", save_last);

    document.getElementById("save-btn").addEventListener("click", saveToCloud);

    document.getElementById("add-reader-btn").addEventListener("click", addReader);

    document.getElementById("load-btn").addEventListener("click", loadFromCloud);

    document.getElementById("file-input").addEventListener("change", loadFile);

    document.getElementById("bar-mitzvah-btn").addEventListener("click", openBarMitzvahModal);

    document.getElementById("add-parasha-btn").addEventListener("click", addParasha);

    loadFromCloud(); // Load from cloud instead of local file

});

 

function clearFunc() {

    const aliyahDropdowns = document.querySelectorAll("select[id^='aliyah-']");

    let i = 1;

    aliyahDropdowns.forEach(dropdown => {

        document.getElementById(`aliyah-${i}`).value = "";

        document.getElementById("parasha_name").value = "";

        i++;

    });

}

 

function save_last() {

    last_readers = [];

    const aliyahDropdowns = document.querySelectorAll("select[id^='aliyah-']");

    let i = 1;

    aliyahDropdowns.forEach(dropdown => {

        let temp = document.getElementById(`aliyah-${i}`).value;

        if (temp && temp !== "") {

            last_readers.push(temp);

        } else {

            last_readers.push("לא נקבע");

        }

        i++;

    });

   

    // Update dropdowns to show red color for last readers

    populateAllDropdowns();

   

    // Show confirmation message

    alert("הקוראים נשמרו בארכיון! הם יופיעו בצבע אדום ברשימת הקוראים.");

   

    console.log("Last readers saved:", last_readers);

}

 

function populateAllDropdowns() {

    const aliyahDropdowns = document.querySelectorAll("select[id^='aliyah-']");

    let i = 1;

    aliyahDropdowns.forEach(dropdown => {

        temp = document.getElementById(`aliyah-${i}`).value

                                populateDropdown(dropdown);

        document.getElementById(`aliyah-${i}`).value = temp;

                                i++;

    });

}

 

function populateDropdown(dropdown) {

    dropdown.innerHTML = "";

    const defaultOption = document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent = "בחר קורא";

    dropdown.appendChild(defaultOption);

 

    readers.forEach(reader => {

        const option = document.createElement("option");

        option.value = reader;

        option.textContent = reader;

 

        if (last_readers.includes(reader)) {

            option.classList.add("red-text");

        }

 

        dropdown.appendChild(option);

    });

}

 

// Save data to JSONBin.io cloud storage

async function saveToCloud() {

    const aliyot = {};

    for (let i = 1; i <= 7; i++) {

        aliyot[`aliyah-${i}`] = document.getElementById(`aliyah-${i}`).value;

    }

 

    const data = {

        parasha: parasha,

        aliyot: aliyot,

        parasha_name: document.getElementById("parasha_name").value,

        last_readers: last_readers,

        readers: readers,

        last_updated: new Date().toISOString()

    };

 

    try {

        console.log('Saving to JSONBin.io...');

        console.log('Data to save:', data);

       

        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {

            method: 'PUT',

            headers: {

                'Content-Type': 'application/json',

                'X-Master-Key': JSONBIN_API_KEY

            },

            body: JSON.stringify(data)

        });

 

        console.log('Save response status:', response.status);

 

        if (response.ok) {

            const result = await response.json();

            console.log('Save response:', result);

            alert('נתונים נשמרו בהצלחה באינטרנט!');

            console.log('Data saved to cloud successfully');

        } else {

            const errorText = await response.text();

            console.error('Save error response:', errorText);

           

            if (response.status === 401) {

                alert('שגיאת הרשאה - API Key לא תקין');

            } else if (response.status === 404) {

                alert('Bin לא נמצא - Bin ID לא תקין');

            } else {

                alert(`שגיאה בשמירת הנתונים: ${response.status} - ${errorText}`);

            }

           

            throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);

        }

    } catch (error) {

        console.error('Error saving to cloud:', error);

       

        if (error.name === 'TypeError' && error.message.includes('fetch')) {

            alert('שגיאת רשת - בדוק חיבור לאינטרנט');

        } else {

            alert('שגיאה בשמירת הנתונים באינטרנט. נסה שוב מאוחר יותר.');

        }

       

        // Fallback to local save

        saveDataLocally();

    }

}

 

// Load data from JSONBin.io cloud storage

async function loadFromCloud() {

    try {

        console.log('Loading from JSONBin.io...');

        console.log('API Key:', JSONBIN_API_KEY.substring(0, 10) + '...');

        console.log('Bin ID:', JSONBIN_BIN_ID);

       

        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {

            headers: {

                'X-Master-Key': JSONBIN_API_KEY

            }

        });

 

        console.log('Response status:', response.status);

        console.log('Response ok:', response.ok);

 

        if (response.ok) {

            const result = await response.json();

            console.log('Response data:', result);

            const data = result.record;

           

            last_readers = data.last_readers || [];

            readers = data.readers || [];

            parasha = data.parasha || {};

            parasha_name = data.parasha_name || "";

           

            populateAllDropdowns();

            document.getElementById("parasha_name").value = parasha_name;

 

            for (let i = 1; i <= 7; i++) {

                document.getElementById(`aliyah-${i}`).value = data.aliyot ? data.aliyot[`aliyah-${i}`] || '' : '';

            }

           

            console.log('Data loaded from cloud successfully');

            alert('נתונים נטענו בהצלחה מהאינטרנט!');

        } else {

            const errorText = await response.text();

            console.error('HTTP Error Response:', errorText);

           

            if (response.status === 401) {

                alert('שגיאת הרשאה - API Key לא תקין');

            } else if (response.status === 404) {

                alert('Bin לא נמצא - Bin ID לא תקין או הבין לא קיים');

            } else {

                alert(`שגיאה בטעינת הנתונים: ${response.status} - ${errorText}`);

            }

           

            throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);

        }

    } catch (error) {

        console.error('Full error details:', error);

       

        if (error.name === 'TypeError' && error.message.includes('fetch')) {

            alert('שגיאת רשת - בדוק חיבור לאינטרנט');

        } else {

            alert('שגיאה בטעינת הנתונים מהאינטרנט. עובר לנתונים מקומיים...');

        }

       

        // Fallback to local load

        loadData();

    }

}

 

// Fallback function for local save (backup)

function saveDataLocally() {

    const aliyot = {};

    for (let i = 1; i <= 7; i++) {

        aliyot[`aliyah-${i}`] = document.getElementById(`aliyah-${i}`).value;

    }

 

    const data = {

        parasha: parasha,

        aliyot: aliyot,

        parasha_name: document.getElementById("parasha_name").value,

        last_readers: last_readers,

        readers: readers

    };

 

    const jsonString = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "data.json";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

}

 

// Keep the original loadData function as fallback for local files

function loadData() {

    fetch('data.json')

        .then(response => {

            if (!response.ok) {

                throw new Error('Network response was not ok');

            }

            return response.json();

        })

        .then(data => {

            last_readers = data.last_readers || [];

            readers = data.readers || [];

            parasha = data.parasha || {};

            parasha_name = data.parasha_name || "";

            populateAllDropdowns();

            document.getElementById("parasha_name").value = parasha_name;

 

            for (let i = 1; i <= 7; i++) {

                document.getElementById(`aliyah-${i}`).value = data.aliyot ? data.aliyot[`aliyah-${i}`] || '' : '';

            }

        })

        .catch(error => console.error('Error loading JSON file:', error));

}

 

function openHistoryListModal() {

    updateLastReadersList();

    document.getElementById("lastreaders-list-modal").style.display = "block";

}

 

function updateLastReadersList() {

    const container = document.getElementById("lastreaders-list-container");

    container.innerHTML = "";

 

    last_readers.forEach((reader, index) => {

        const aliyahItem = document.createElement("div");

        aliyahItem.className = "parasha-item";

 

        const aliyahText = document.createElement("span");

        aliyahText.textContent = aliyot_list[index] || `איליה ${index + 1}`;

        aliyahText.style.color = "green";

        aliyahText.style.fontWeight = "bold";

 

        aliyahItem.appendChild(aliyahText);

 

        const readersText = document.createElement("span");

        readersText.textContent = reader;

        readersText.style.color = "black";

 

        aliyahItem.appendChild(readersText);

 

        container.appendChild(aliyahItem);

    });

}

 

function openReadersListModal() {

    updateReadersList();

    document.getElementById("readers-list-modal").style.display = "block";

}

 

function closeModal(modalId) {

    document.getElementById(modalId).style.display = "none";

}

 

function updateReadersList() {

    const container = document.getElementById("readers-list-container");

    container.innerHTML = "";

 

    readers.forEach((reader, index) => {

        const readerItem = document.createElement("div");

        readerItem.className = "reader-item";

 

        const readerName = document.createElement("span");

        readerName.textContent = reader;

 

        const removeButton = document.createElement("button");

        removeButton.innerHTML = "X";

        removeButton.onclick = () => {

            removeReader(index);

            populateAllDropdowns();

        };

 

        readerItem.appendChild(readerName);

        readerItem.appendChild(removeButton);

        container.appendChild(readerItem);

    });

}

 

function removeReader(index) {

    readers.splice(index, 1);

    updateReadersList();

}

 

function addReader() {

    const newReader = prompt("הזן שם של קורא חדש:");

    if (newReader) {

        readers.push(newReader);

        updateReadersList();

        populateAllDropdowns();

    }

}

 

function loadFile(event) {

    const file = event.target.files[0];

    if (file && file.type === "application/json") {

        const reader = new FileReader();

        reader.onload = function(e) {

            try {

                const data = JSON.parse(e.target.result);

                last_readers = data.last_readers || [];

                readers = data.readers || [];

                parasha = data.parasha || {};

                parasha_name = data.parasha_name || "";

 

                populateAllDropdowns();

                for (let i = 1; i <= 7; i++) {

                    document.getElementById(`aliyah-${i}`).value = data.aliyot ? data.aliyot[`aliyah-${i}`] || '' : '';

                }

                document.getElementById("parasha_name").value = parasha_name;

            } catch (error) {

                console.error('Error parsing JSON file:', error);

            }

        };

        reader.readAsText(file);

    } else {

        alert("אנא בחר קובץ JSON תקין.");

    }

}

 

function openBarMitzvahModal() {

    updateParashaList();

    document.getElementById("bar-mitzvah-modal").style.display = "block";

}

 

function updateParashaList() {

    const container = document.getElementById("parasha-list-container");

    container.innerHTML = "";

 

    for (let parashaName in parasha) {

        const parashaItem = document.createElement("div");

        parashaItem.className = "parasha-item";

 

        const parashaText = document.createElement("span");

        parashaText.textContent = `${parashaName}: `;

        parashaText.style.color = "green";

        parashaText.style.fontWeight = "bold";

 

        parashaItem.appendChild(parashaText);

 

        const readersText = document.createElement("span");

        readersText.textContent = parasha[parashaName].join(", ");

        readersText.style.color = "black";

 

        parashaItem.appendChild(readersText);

 

        const removeButton = document.createElement("button");

        removeButton.innerHTML = "X";

        removeButton.onclick = () => {

            removeParasha(parashaName);

        };

 

        parashaItem.appendChild(removeButton);

        container.appendChild(parashaItem);

    }

}

 

function removeParasha(parashaName) {

    delete parasha[parashaName];

    updateParashaList();

}

 

function addParasha() {

    const newParasha = prompt("הזן שם של פרשה חדשה או קיימת:");

    if (newParasha) {

        const newReader = prompt("הזן שם של קורא עבור הפרשה:");

        if (newReader) {

            if (!parasha[newParasha]) {

                parasha[newParasha] = [];

            }

            parasha[newParasha].push(newReader);

            updateParashaList();

        }

    }

}