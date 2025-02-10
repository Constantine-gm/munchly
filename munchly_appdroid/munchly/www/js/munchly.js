// JavaScript to toggle the sidebar
const customBox = document.getElementById("customBox");
document.getElementById("show").addEventListener("click", function () {
    customBox.classList.toggle("active");
});

window.addEventListener("click", function(event){
    if(!event.target.matches("#customBox *") && !event.target.matches("#show *")){
        customBox.classList.remove("active")
    }

})

function updateDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.deleteBtnStyle');
    deleteButtons.forEach(button => {
        button.textContent = translations[currentLanguage]["Delete"];
    });
    loadBuyItems();
}
   // LOGIN

const loginBtn = document.getElementById("loginBtn");
const profile = document.getElementById("profile");
const profileName = document.getElementById("profileName");
const loginPopup = document.getElementById("loginPopup");
const closeLoginPopup = document.getElementById("closeLoginPopup");
const logoutPopup = document.getElementById("logoutPopup");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const closeLogoutPopup = document.getElementById("closeLogoutPopup");

// Funzione per aprire il popup
function openPopup(popupId) {
  document.getElementById(popupId).style.display = "flex";
}

// Funzione per chiudere il popup
function closePopup(popupId) {
  document.getElementById(popupId).style.display = "none";
}

// Funzione di login
function login() {
  const username = usernameInput.value;
  const email = emailInput.value;
  if (username && email) {
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("loggedIn", "true");  // Aggiungiamo il flag di login
    closePopup("loginPopup");
    displayProfile();

      // Carica gli oggetti
      loadObjects();
  }
}

// Funzione di log out
function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("loggedIn"); // Rimuoviamo il flag di login
    closePopup("logoutPopup");
    displayProfile();
  
    // Ricarica la pagina per riflettere immediatamente lo stato di logout
    location.reload();  // Questo ricarica la pagina
  }
  
// Funzione per mostrare il profilo utente
function displayProfile() {
  const username = localStorage.getItem("username");
  const greetingText = translations[currentLanguage].greeting; // Ottieni il saluto tradotto

  if (username) {
    // Combinare il saluto tradotto con il nome utente e assegnarlo direttamente a profileName
    document.getElementById('profileName').textContent = greetingText + " " + username;

    profile.style.display = "block"; // Mostra il profilo
    loginBtn.style.display = "none"; // Nasconde il bottone login
    totalsBox.style.display = "block";
  } else {
    profile.style.display = "none"; // Nasconde il profilo
    loginBtn.style.display = "block"; // Mostra il bottone login
    totalsBox.style.display = "none";
  }
}

// Mostra il pop-up di logout quando clicchi su "Ciao, Nome Utente"
profileName.addEventListener("click", () => {
  openPopup("logoutPopup");
});

// Mostra il pop-up di login quando clicchi sul bottone "Login"
loginBtn.addEventListener("click", () => {
  openPopup("loginPopup");
});

// Aggiungi evento per chiudere il pop-up di logout quando clicchi sull'icona X
closeLogoutPopup.addEventListener("click", function () {
  closePopup("logoutPopup");
});

// Aggiungi evento per chiudere il pop-up di login quando clicchi sull'icona X
closeLoginPopup.addEventListener("click", function () {
  closePopup("loginPopup");
});

// Imposta showAll su true quando la pagina viene caricata
window.onload = function() {
    displayProfile();


    // Se l'utente non è loggato e non ha mai effettuato il login, mostra il pop-up di login
    if (!localStorage.getItem("loggedIn")) {
        openPopup("loginPopup");
    } 

    // Assicurati che il pop-up di logout sia nascosto appena la pagina si carica
    closePopup("logoutPopup");

    // Carica gli oggetti
    loadObjects();
};


    //List
        let showAll = false;
        let recentlyDeleted = null;  // Memorize the deleted item and quantity
    
        function loadObjects() {
            // Verifica se l'utente è loggato
            if (!localStorage.getItem("loggedIn")) {
              // Se l'utente non è loggato, nascondi la lista degli oggetti
              const objectList = document.getElementById('objectList');
              objectList.innerHTML = ''; // Pulisce la lista degli oggetti
              return; // Non caricare gli oggetti
            }
        
            // Continuare con il caricamento degli oggetti solo se l'utente è loggato
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
        
                updateTotals();
        }
    

        // Funzione per suggerire i nomi degli oggetti mentre l'utente digita
function suggestObjectName() {
    const inputField = document.getElementById('objectName');
    const suggestionList = document.getElementById('suggestionList');
    const name = inputField.value.toLowerCase();  // Prendi il nome dell'oggetto inserito

    if (!name) {
        suggestionList.innerHTML = ''; // Se il campo è vuoto, nascondi i suggerimenti
        return;
    }

    const savedObjects = JSON.parse(localStorage.getItem('objects')) || [];

    // Filtra gli oggetti salvati che iniziano con il testo digitato
    const suggestions = savedObjects
        .map(obj => obj.name)  // Ottieni i nomi degli oggetti
        .filter(itemName => itemName.toLowerCase().includes(name))  // Filtra per il testo digitato
        .slice(0, 5);  // Limita i suggerimenti a 5

    suggestionList.innerHTML = ''; // Pulisce la lista dei suggerimenti

    // Aggiungi i suggerimenti nella lista
    suggestions.forEach(itemName => {
        const li = document.createElement('li');
        li.textContent = itemName;
        li.onclick = () => {
            inputField.value = itemName;  // Se l'utente clicca su un suggerimento, lo inserisce nel campo
            suggestionList.innerHTML = ''; // Pulisce i suggerimenti dopo la selezione
        };
        suggestionList.appendChild(li);
    });
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
              // Aggiorna il totale dei prodotti
              updateTotals();
    
        }


// Aggiungi un evento di input per suggerire gli articoli mentre l'utente digita
document.getElementById('objectName').addEventListener('input', suggestObjectName);
    
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
                updateTotals();
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
                  // Aggiorna il totale dei prodotti
    updateTotals();
            }
        }
    
        // Function to add item to the list "To Buy"
        function addBuyItem() {
            const buyItemName = document.getElementById('buyItemName').value;
            const inputField = document.getElementById('buyItemName'); // Get the input field
        
            if (!buyItemName) {
                alert("Insert name of the item to buy");
                return;
            }
        
            const savedBuyItems = JSON.parse(localStorage.getItem('buyItems')) || [];
        
            // Check if the item is already in the list
            if (savedBuyItems.includes(buyItemName)) {
                // Add error class to input field
                inputField.classList.add('input-error');
                return; // Don't add the item if it's already in the list
            }
        
            // Remove error class if the input is valid
            inputField.classList.remove('input-error');
        
            savedBuyItems.push(buyItemName);
            localStorage.setItem('buyItems', JSON.stringify(savedBuyItems));
        
            inputField.value = ''; // Clear input
        
            loadBuyItems();
            updateTotals();
        }
        // Aggiungi un evento di focus per rimuovere il bordo rosso quando l'utente modifica l'input
document.getElementById('buyItemName').addEventListener('focus', function() {
    this.classList.remove('input-error'); // Rimuove il bordo rosso quando l'utente interagisce con l'input
});
    
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
              // Aggiorna il totale dei prodotti
            updateTotals();
        }
    
    
    
      // Suggested items
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
        const { savedObjects, savedBuyItems } = loadSavedData();
        const suggestionList = document.getElementById("suggestionList");
        suggestionList.innerHTML = ""; // Clear the list
    
        // Obtain suggested items in the current language
        const defaultSuggestions = defaultSuggestionsByLanguage[currentLanguage];
        const suggestedItems = new Set(savedBuyItems);

         // Function to generate a frequency map for the saved objects
    function generateFrequencyMap(savedObjects) {
        const frequencyMap = new Map();
        savedObjects.forEach(obj => {
            frequencyMap.set(obj.name, (frequencyMap.get(obj.name) || 0) + obj.quantity);
        });
        return frequencyMap;
    }
    
    // Frequency Map for saved objects
    const frequencyMap = generateFrequencyMap(savedObjects);

    
       // Sort items by frequency in descending order
    const sortedItems = Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1]) // Sort by quantity (value of the map)
    .map(entry => entry[0]); // Extract just the item names
    
     // Add sorted items based on frequency first, then default suggestions if needed
     let suggestionCount = 0;
     sortedItems.concat(defaultSuggestions).forEach(itemName => {
         if (suggestionCount >= 7) return; // Stop after 7 items
 
         if (!suggestedItems.has(itemName)) {
             createSuggestionItem(itemName, suggestionList);
             suggestedItems.add(itemName);
             suggestionCount++;
         }
     });
 }
 
    
    // Function to load saved objects and buy items from localStorage
    function loadSavedData() {
        const savedObjects = JSON.parse(localStorage.getItem("objects")) || [];
        const savedBuyItems = JSON.parse(localStorage.getItem("buyItems")) || [];
        return { savedObjects, savedBuyItems };
    }
    
    // Function to create a suggestion item in the UI
    function createSuggestionItem(itemName, suggestionList) {
        const li = document.createElement("li");
        li.textContent = itemName;
    
        const addBtn = document.createElement("button");
        addBtn.textContent = currentLanguage === "it" ? "Aggiungi" : "Add";
        
        addBtn.onclick = () => {
            addItemToBuyList(itemName);
            loadBuyItems(); // Refresh the buy list
            loadSuggestions(); // Refresh the suggestion list
            updateTotals();
        };
    
        li.appendChild(addBtn);
        suggestionList.appendChild(li);
    }
    
    // Function to add item to buy list and update localStorage
    function addItemToBuyList(itemName) {
        const savedBuyItems = JSON.parse(localStorage.getItem('buyItems')) || [];
        savedBuyItems.push(itemName);
        localStorage.setItem('buyItems', JSON.stringify(savedBuyItems));
    
        // Clear the input field
        document.getElementById('buyItemName').value = '';
    }
    
    
    
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
            "Shopping List": "Lista della Spesa",
            "Suggestions": "Suggerimenti",
            "Add": "Aggiungi",
            "Find Items": "Trova Articoli",
            "Insert Items": "Inserisci Articoli",
            "Insert item name and expiry date.": "Inserisci nome e data di scadenza dell'articolo.",
            "Insert name of the item to buy": "Inserisci il nome dell'articolo da comprare",
            "Export": "Esporta",
            "loginButton": "Accedi",
            "greeting": "Ciao, ",
            "loginPopupTitle": "Accedi al tuo account",
            "usernamePlaceholder": "Nome Utente",
            "emailPlaceholder": "Email",
            "loginButtonAction": "Accedi",
            "logoutConfirmation": "Sei sicuro di voler fare il log out?",
            "logoutButton": "Esci",
            "Username": "Nome Utente",
            "Email": "Email",
          
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
            "Shopping List": "Shopping List",
            "Suggestions": "Suggestions",
            "Add": "Add",
            "Find Items": "Find Items",
            "Insert Items": "Insert Items",
            "Insert item name and expiry date.": "Insert item name and expiry date.",
            "Insert name of the item to buy": "Insert name of the item to buy",
            "Export": "Export",
            "loginButton": "Login",
            "greeting": "Hello, ",
            "loginPopupTitle": "Sign in to your account",
            "usernamePlaceholder": "Username",
            "emailPlaceholder": "Email",
            "loginButtonAction": "Log In",
            "logoutConfirmation": "Are you sure you want to log out?",
            "logoutButton": "Log Out",
            "Username": "Username",
            "Email": "Email",
        }
    };
    

         let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    document.addEventListener('DOMContentLoaded', () => {
        // Recupera la lingua salvata in localStorage, altrimenti usa 'en' come predefinito


        // Applica la lingua salvata
        changeLanguage(currentLanguage);
    });
    
    function changeLanguage(language) {
        currentLanguage = language; 
        localStorage.setItem('selectedLanguage', language);

    
        // Cambia l'icona della lingua in base alla lingua selezionata
        const languageIcon = document.getElementById('language-icon');
        if (language === 'it') {
            languageIcon.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1500px-Flag_of_Italy.svg.png';
            languageIcon.alt = 'Italian Flag';
        } else if (language === 'en') {
            languageIcon.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/1200px-Flag_of_the_United_Kingdom_%283-5%29.svg.png'; 
            languageIcon.alt = 'English Flag';
        }
    
   
 // Cambia il testo degli elementi sulla pagina in base alla lingua selezionata
 document.querySelectorAll("[data-translate-key]").forEach((element) => {
    const key = element.getAttribute("data-translate-key");
    if (translations[language][key]) {
        element.textContent = translations[language][key];
    }
});

    
   // Cambia i placeholder dinamicamente
   const searchBar = document.getElementById("searchBar");
   if (searchBar) searchBar.placeholder = translations[language]["Find Items"];
   const buyItemInput = document.getElementById("buyItemName");
   if (buyItemInput) buyItemInput.placeholder = translations[language]["Insert Items"];
   const usernameInput = document.getElementById("username");
if (usernameInput) usernameInput.placeholder = translations[language]["Username"];

const emailInput = document.getElementById("email");
if (emailInput) emailInput.placeholder = translations[language]["Email"];
   
   // Ricarica altre informazioni
   loadSuggestions(); 
   updateDeleteButtons(); 

   displayProfile();  
   updateTotals();
}
    
 // Aggiungi un evento al pulsante di cambio lingua
document.getElementById('change-lang-button').addEventListener('click', function() {
    // Cambia la lingua quando l'utente clicca
    if (currentLanguage === 'it') {
        changeLanguage('en'); // Cambia a inglese
    } else {
        changeLanguage('it'); // Cambia a italiano
    }
});

//COUNTER ITEMS
// Funzione per aggiornare i totali dei prodotti nelle due liste
function updateTotals() {
    const savedObjects = JSON.parse(localStorage.getItem('objects')) || [];
    const savedBuyItems = JSON.parse(localStorage.getItem('buyItems')) || [];

    // Conta tutti i prodotti in scadenza (anche quelli non visibili)
    const expiryCount = savedObjects.reduce((count, obj) => {
        const expiryDate = new Date(obj.expiryDate);
        if (expiryDate >= new Date()) {
            count += obj.quantity; // Aggiungi la quantità dell'oggetto
        }
        return count;
    }, 0);

    const buyCount = savedBuyItems.length;

    // Aggiorna il contatore nella pagina
    document.getElementById("expiryCount").textContent = expiryCount;
    document.getElementById("buyCount").textContent = buyCount;
}

    
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
            updateTotals();
        }
    
     // Aggiungi un ascoltatore di eventi per il clic del pulsante Export
     document.getElementById("exportButton").addEventListener("click", exportListAsText);
    
     function exportListAsText() {
         // Recupera le liste salvate nel localStorage
         const savedObjects = JSON.parse(localStorage.getItem('objects')) || [];
         const savedBuyItems = JSON.parse(localStorage.getItem('buyItems')) || [];
    
         // Salva entrambe le liste nel localStorage per la pagina viewList
         localStorage.setItem("viewListObjects", JSON.stringify(savedObjects));
         localStorage.setItem("viewListBuyItems", JSON.stringify(savedBuyItems));
    
         // Naviga alla pagina viewList.html
         window.location.href = "viewList.html";
     }
    
        // Loads items and to buy items as the page opens
        loadObjects();
        loadBuyItems();
        displayProfile(); 
        updateTotals(); 
    
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
    