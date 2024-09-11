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
    document.getElementById("save-btn").addEventListener("click", saveToGist);
    document.getElementById("add-reader-btn").addEventListener("click", addReader);
    document.getElementById("load-btn").addEventListener("click", () => document.getElementById("file-input").click());
    document.getElementById("file-input").addEventListener("change", fetchFromGist);
    document.getElementById("bar-mitzvah-btn").addEventListener("click", openBarMitzvahModal);
    document.getElementById("add-parasha-btn").addEventListener("click", addParasha);
    fetchFromGist();
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
        if (temp) {
            last_readers.push(temp);
        } else {
            last_readers.push("לא נקבע");
        }
        i++;
    });
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

function saveData() {
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

    const GIST_ID = '3a235e7323ff95464227325be339c35a'; // Replace with your actual Gist ID
    const GITHUB_TOKEN = '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'; // Replace with your GitHub token


	


// Function to fetch JSON data from the Gist (replaces loadData)
function fetchFromGist() {
    fetch(`https://api.github.com/gists/${GIST_ID}`)
        .then(response => response.json())
        .then(data => {
            const fileContent = data.files['data.json'].content;
            const parsedData = JSON.parse(fileContent);
            last_readers = parsedData.last_readers || [];
            readers = parsedData.readers || [];
            parasha = parsedData.parasha || {};
            parasha_name = parsedData.parasha_name || "";
            populateAllDropdowns();
            document.getElementById("parasha_name").value = parasha_name;

            for (let i = 1; i <= 7; i++) {
                document.getElementById(`aliyah-${i}`).value = parsedData.aliyot ? parsedData.aliyot[`aliyah-${i}`] || '' : '';
            }
        })
        .catch(error => console.error('Error fetching Gist:', error));
}

// Function to update the Gist with new JSON data (replaces saveData)
function saveToGist() {
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

    const jsonString = JSON.stringify(data, null, 2); // Format the JSON nicely

    fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            files: {
                'data.json': {
                    content: jsonString
                }
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        alert('Gist updated successfully!');
    })
    .catch(error => {
        console.error('Error updating Gist:', error);
    });
}
	