     // JavaScript to toggle the sidebar
 document.getElementById("show").addEventListener("click", function() {
    var customBox = document.getElementById("customBox");
    customBox.classList.toggle("active");
});

function updateDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.deleteBtnStyle');
    deleteButtons.forEach(button => {
        button.textContent = translations[currentLanguage]["Delete"];
    });
}
        
        let showAll = false;
    let recentlyDeleted = null;  // Memorize the deleted item and quantity

    // Function for loading the items
    function loadObjects() {
        const savedObjects = JSON.parse(localStorage.getItem('objects')) || [];
        const today = new Date();
        const threeDaysLater = new Date(today);
        threeDaysLater.setDate(today.getDate() + 3);

        savedObjects.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

        const objectList = document.getElementById('objectList');
        objectList.innerHTML = '';

        savedObjects.forEach((obj) => {
            const formattedDate = formatDate(obj.expiryDate);

            // Repeat the items based on quantity
            for (let i = 0; i < obj.quantity; i++) {
                const tr = document.createElement('tr');
                
                const nameTd = document.createElement('td');
                nameTd.textContent = obj.name;
                tr.appendChild(nameTd);

                const expiryTd = document.createElement('td');
                expiryTd.textContent = formattedDate;
                tr.appendChild(expiryTd);

                const expiryDate = new Date(obj.expiryDate);
                // Add class "red" for the items expiring in the next 3 days
                if (expiryDate <= threeDaysLater && expiryDate >= today) {
                    tr.classList.add('red');
                }

                // Add class 'red2' for the items that expire today
                if (expiryDate.toDateString() === today.toDateString()) {
                    tr.classList.add('red2');
                }

                // If ShowAll is Active, remove calss 'hidden'
                if (showAll) {
                    tr.classList.remove('hidden');
                } else {
                    if (!tr.classList.contains('red') && !tr.classList.contains('red2')) {
                        tr.classList.add('hidden');
                    }
                }

                // Creates the delete button
                const deleteTd = document.createElement('td');
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = translations[currentLanguage]["Delete"];
                deleteBtn.classList.add('deleteBtnStyle');
                deleteBtn.onclick = () => deleteObject(obj.id); // ID of the Item
                deleteTd.appendChild(deleteBtn);
                tr.appendChild(deleteTd);

                objectList.appendChild(tr);
                
            }
        });

        // Shows the button to restore the deleted items if existing
        const undoDiv = document.getElementById('undoDiv');
        if (recentlyDeleted) {
            undoDiv.style.display = 'block';
        } else {
            undoDiv.style.display = 'none';
        }

        // Loads suggestions
        loadSuggestions();
        updateDeleteButtons();
    }

    // Function to add items
    function addObject() {
        const name = document.getElementById('objectName').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const quantity = parseInt(document.getElementById('quantity').value) || 1;

        if (!name || !expiryDate) {
            alert("Insert item name and expiry date.");
            return;
        }

        const savedObjects = JSON.parse(localStorage.getItem('objects')) || [];

        // Generates an unique ID for each items
        const newObject = {
            id: Date.now(),
            name,
            expiryDate,
            quantity
        };

        savedObjects.push(newObject);
        localStorage.setItem('objects', JSON.stringify(savedObjects));

        document.getElementById('objectName').value = '';
        document.getElementById('expiryDate').value = '';
        document.getElementById('quantity').value = '';

        loadObjects();
    }

    // Function to format data
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT');
    }

    // Function for deleting items.
    function deleteObject(id) {
        const savedObjects = JSON.parse(localStorage.getItem('objects')) || [];

        //Finds an item to delete
        const objectToDelete = savedObjects.find(obj => obj.id === id);
        if (objectToDelete && objectToDelete.quantity > 1) {
            // Memorize the deleted item and quantity
            recentlyDeleted = { ...objectToDelete, quantity: 1 }; // Saves the item to restore with quantity (with quantity 1)
            
            // Reduce quantity to 1
            objectToDelete.quantity -= 1;

            //  Save the updated array
            localStorage.setItem('objects', JSON.stringify(savedObjects));
            loadObjects();
        } else if (objectToDelete) {
            // If quantity is 1, removes the item
            recentlyDeleted = objectToDelete; // Saves the item to restore
            const updatedObjects = savedObjects.filter(obj => obj.id !== id);
            localStorage.setItem('objects', JSON.stringify(updatedObjects));
            loadObjects();
        }
    }

    // Function to restore deleted item
    function restoreDeletedObject() {
        if (recentlyDeleted) {
            const savedObjects = JSON.parse(localStorage.getItem('objects')) || [];

            // If an item with quantity > 1 is deleted, the item with that quantity is restored
            const objectToRestore = savedObjects.find(obj => obj.id === recentlyDeleted.id);
            if (objectToRestore) {
                objectToRestore.quantity += recentlyDeleted.quantity; // Ripristina la quantità eliminata
            } else {
                // If it doesn't exist, adds the item with its original quantity
                savedObjects.push(recentlyDeleted);
            }

            // Saves the updated array
            localStorage.setItem('objects', JSON.stringify(savedObjects));

            recentlyDeleted = null; // Reset of the variable

            loadObjects();
        }
    }

    // Function to add item to the list "To Buy"
    function addBuyItem() {
        const buyItemName = document.getElementById('buyItemName').value;

        if (!buyItemName) {
            alert("Insert name of the item to buy");
            return;
        }

        const savedBuyItems = JSON.parse(localStorage.getItem('buyItems')) || [];
        savedBuyItems.push(buyItemName);

        localStorage.setItem('buyItems', JSON.stringify(savedBuyItems));

        document.getElementById('buyItemName').value = '';

        loadBuyItems();
    }

    // Function for loading "to Buy" items
    function loadBuyItems() {
        const savedBuyItems = JSON.parse(localStorage.getItem('buyItems')) || [];
        const buyItemList = document.getElementById('buyItemList');
        buyItemList.innerHTML = '';

        savedBuyItems.forEach((item, index) => {
            const tr = document.createElement('tr');
            const nameTd = document.createElement('td');
            nameTd.textContent = item;
            tr.appendChild(nameTd);

            const deleteTd = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = translations[currentLanguage]["Delete"];
            deleteBtn.classList.add('deleteBtnStyle');
            deleteBtn.onclick = () => deleteBuyItem(index);
            deleteTd.appendChild(deleteBtn);
            tr.appendChild(deleteTd);

            buyItemList.appendChild(tr);
        });
    }

    // Function to delete items on the list "to buy"
    function deleteBuyItem(index) {
        const savedBuyItems = JSON.parse(localStorage.getItem('buyItems')) || [];
        savedBuyItems.splice(index, 1);
        localStorage.setItem('buyItems', JSON.stringify(savedBuyItems));

        loadBuyItems();
    }



   // Suggested itms
const defaultSuggestionsByLanguage = {
    en: [
        "Olive oil", "Cherry tomatoes", "Salad", "Flour", "Lettuce", "Garlic",
        "Cheese", "Milk", "Pasta", "Meat", "Toothpaste", "Napkins",
        "Brush", "Toilet paper", "Detergent", "Shampoo", "Soap", "Laundry bag"
    ],
    it: [
        "Olio d'oliva", "Pomodorini", "Insalata", "Farina", "Lattuga", "Aglio",
        "Formaggio", "Latte", "Pasta", "Carne", "Dentifricio", "Tovaglioli",
        "Spazzola", "Carta igienica", "Detergente", "Shampoo", "Sapone", "Sacca per il lavaggio"
    ]
};

// Function to load suggested items
function loadSuggestions() {
    const savedObjects = JSON.parse(localStorage.getItem("objects")) || [];
    const savedBuyItems = JSON.parse(localStorage.getItem("buyItems")) || [];
    const suggestionList = document.getElementById("suggestionList");
    suggestionList.innerHTML = ""; 

    // Obtain suggested items in the current language
    const defaultSuggestions = defaultSuggestionsByLanguage[currentLanguage];

    // If there are no saved items, load default suggestions
    if (savedObjects.length === 0 && savedBuyItems.length === 0) {
        defaultSuggestions.forEach(itemName => {
            if (!savedBuyItems.includes(itemName)) {
                createSuggestionItem(itemName, suggestionList);
            }
        });
        return;
    }

    // Frequency Map for suggested Items
    const frequencyMap = savedObjects.reduce((acc, obj) => {
        acc[obj.name] = (acc[obj.name] || 0) + obj.quantity;
        return acc;
    }, {});

    // Sort the elements by frequency
    const sortedItems = Object.keys(frequencyMap).sort((a, b) => frequencyMap[b] - frequencyMap[a]);

    // Add suggested items sorted
    const suggestedItems = new Set();
    let suggestionCount = 0;

    sortedItems.forEach(itemName => {
        if (suggestionCount >= 7) return;
        if (!savedBuyItems.includes(itemName) && !suggestedItems.has(itemName)) {
            createSuggestionItem(itemName, suggestionList);
            suggestedItems.add(itemName);
            suggestionCount++;
        }
    });

    // IF there are not enough suggested items, creates them
    defaultSuggestions.forEach(itemName => {
        if (suggestionCount >= 7) return;
        if (!savedBuyItems.includes(itemName) && !suggestedItems.has(itemName)) {
            createSuggestionItem(itemName, suggestionList);
            suggestedItems.add(itemName);
            suggestionCount++;
        }
    });
}

function createSuggestionItem(itemName, suggestionList) {
    const li = document.createElement("li");
    li.textContent = itemName;

    const addBtn = document.createElement("button");
    addBtn.textContent = currentLanguage === "it" ? "Aggiungi" : "Add";
    
    // Update this line to call the correct function
    addBtn.onclick = () => {
        // Directly add the suggested item to the "to buy" list
        const buyItemName = itemName;
        const savedBuyItems = JSON.parse(localStorage.getItem('buyItems')) || [];
        savedBuyItems.push(buyItemName);
        localStorage.setItem('buyItems', JSON.stringify(savedBuyItems));

        // Clear the input field and reload the list
        document.getElementById('buyItemName').value = '';
        loadBuyItems();
    };

    li.appendChild(addBtn);
    suggestionList.appendChild(li);
}



const languageTranslations = {
    Suggestions: { en: "Suggestions", it: "Suggerimenti" },
    Add: { en: "Add", it: "Aggiungi" },
    // Add other translation keys as needed
};

const translations = {
    it: {
        "Dark Mode": "Modalità Scura",
        "Color Picker": "Selettore Colore",
        "Change Color": "Cambia Colore",
        "Background:": "Sfondo:",
        "Text:": "Testo:",
        "Reset Colors": "Ripristina Colori",
        "Show All": "Mostra Tutti",
        "Product": "Prodotto",
        "Expiry": "Scadenza",
        "Delete": "Elimina",
        "Expiry List": "Lista Scadenze",
        "To Buy List": "Lista da Comprare",
        "Suggestions": "Suggerimenti",
        "Add": "Aggiungi",
        "Find Items": "Trova Articoli",
        "Insert Items": "Inserisci Articoli",
        "Insert item name and expiry date.": "Inserisci nome e data di scadenza dell'articolo.",
        "Insert name of the item to buy": "Inserisci il nome dell'articolo da comprare",
    },
    en: {
        "Dark Mode": "Dark Mode",
        "Color Picker": "Color Picker",
        "Change Color": "Change Color",
        "Background:": "Background:",
        "Text:": "Text:",
        "Reset Colors": "Reset Colors",
        "Show All": "Show All",
        "Product": "Product",
        "Expiry": "Expiry",
        "Delete": "Delete",
        "Expiry List": "Expiry List",
        "To Buy List": "To Buy List",
        "Suggestions": "Suggestions",
        "Add": "Add",
        "Find Items": "Find Items",
        "Insert Items": "Insert Items",
        "Insert item name and expiry date.": "Insert item name and expiry date.",
        "Insert name of the item to buy": "Insert name of the item to buy",
    }
};

let currentLanguage = 'en'; // Impostazione della lingua predefinita a 'en' (inglese)

// Funzione per cambiare lingua e icona
function changeLanguage(language) {
    currentLanguage = language; // Aggiorna la lingua corrente

    // Cambia l'icona della lingua in base alla lingua selezionata
    const languageIcon = document.getElementById('language-icon');
    if (language === 'it') {
        languageIcon.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1500px-Flag_of_Italy.svg.png';
        languageIcon.alt = 'Italian Flag';
    } else if (language === 'en') {
        languageIcon.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/1200px-Flag_of_the_United_Kingdom_%283-5%29.svg.png'; 
        languageIcon.alt = 'English Flag';
    }

    // Aggiorna gli elementi con la traduzione in base alla lingua selezionata
    document.querySelectorAll("[data-translate-key]").forEach((element) => {
        const key = element.getAttribute("data-translate-key");
        if (translations[language][key]) {
            element.textContent = translations[language][key]; // Aggiorna il testo
        }
    });

    // Cambia i placeholder dinamicamente
    const searchBar = document.getElementById("searchBar");
    if (searchBar) searchBar.placeholder = translations[language]["Find Items"];
    
    const buyItemInput = document.getElementById("buyItemName");
    if (buyItemInput) buyItemInput.placeholder = translations[language]["Insert Items"];

    loadSuggestions(); // Funzione personalizzata per ricaricare suggerimenti

    updateDeleteButtons(); // Funzione per aggiornare i bottoni di eliminazione
}

// Aggiungi l'evento di clic sul bottone di cambio lingua
document.getElementById('change-lang-button').addEventListener('click', function() {
    // Se la lingua corrente è italiano, cambia in inglese, altrimenti cambia in italiano
    if (currentLanguage === 'it') {
        changeLanguage('en'); // Cambia in inglese
    } else {
        changeLanguage('it'); // Cambia in italiano
    }
});


// Call language change function when the page loads to set the default language
document.addEventListener("DOMContentLoaded", () => {
    loadSuggestions(); // Load initial suggestions
});


    // Function for searching the items
    function searchObjects() {
        const query = document.getElementById('searchBar').value.toLowerCase();
        const savedObjects = JSON.parse(localStorage.getItem('objects')) || [];
        const objectList = document.getElementById('objectList');
        objectList.innerHTML = '';

        savedObjects.forEach((obj) => {
            if (obj.name.toLowerCase().includes(query)) {
                const formattedDate = formatDate(obj.expiryDate);

                for (let i = 0; i < obj.quantity; i++) {
                    const tr = document.createElement('tr');
                    const nameTd = document.createElement('td');
                    nameTd.textContent = obj.name;
                    tr.appendChild(nameTd);

                    const expiryTd = document.createElement('td');
                    expiryTd.textContent = formattedDate;
                    tr.appendChild(expiryTd);

                    const deleteTd = document.createElement('td');
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.classList.add('deleteBtnStyle');
                    deleteBtn.onclick = () => deleteObject(obj.id);
                    deleteTd.appendChild(deleteBtn);
                    tr.appendChild(deleteTd);

                    objectList.appendChild(tr);
                }
            }
        });
    }

    // Function to toggle visibility to all the items
    function toggleShowAll() {
        showAll = !showAll;
        loadObjects();
    }

    // Loads items and to buy items as the page opens
    loadObjects();
    loadBuyItems();

//Color Picker
    // Function to apply selected colors
function applyColors() {
    const backgroundColor = document.getElementById('background-color').value;
    const textColor = document.getElementById('text-color').value;

    // Change color of background, header and th
    document.querySelector('header').style.backgroundColor = backgroundColor;
    const thElements = document.querySelectorAll('th');
    thElements.forEach(th => {
        th.style.backgroundColor = backgroundColor;
    });

    // Change color of text di th e titles
    thElements.forEach(th => {
        th.style.color = textColor;
    });
    document.querySelector('.title').style.color = textColor;
}

// Function to reset color to default
function resetColors() {
    document.getElementById('background-color').value = "#5bb1c2";
    document.getElementById('text-color').value = "#ffffff";

    // Set color to default (header and th)
    document.querySelector('header').style.backgroundColor = "#5bb1c2";
    const thElements = document.querySelectorAll('th');
    thElements.forEach(th => {
        th.style.backgroundColor = "#5bb1c2";
        th.style.color = "#ffffff";
    });

    // Set titles color to default
    document.querySelector('.title').style.color = "#ffffff";
}

// Add an event listeners to the color picker to apply changes
document.getElementById('background-color').addEventListener('input', applyColors);
document.getElementById('text-color').addEventListener('input', applyColors);

// Add an event listener to reset button
document.getElementById('reset-btn').addEventListener('click', resetColors);

  document.getElementById('darkmode-toggle').addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});
