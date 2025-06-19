

// JavaScript to toggle the sidebar
const customBox = document.getElementById("customBox");
document.getElementById("show").addEventListener("click", function () {
  customBox.classList.toggle("active");
});

window.addEventListener("click", function (event) {
  if (
    !event.target.matches("#customBox *") &&
    !event.target.matches("#show *")
  ) {
    customBox.classList.remove("active");
  }
});

function updateDeleteButtons() {
  const deleteButtons = document.querySelectorAll(".deleteBtnStyle");
  deleteButtons.forEach((button) => {
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
    localStorage.setItem("loggedIn", "true"); // Aggiungiamo il flag di login
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
  location.reload(); // Questo ricarica la pagina
}

// Funzione per mostrare il profilo utente
function displayProfile() {
  // Recupera il nome utente da localStorage e gestisce il caso in cui non esista
  const username = localStorage.getItem("username");

  // Verifica se l'oggetto delle traduzioni per la lingua selezionata è valido
  const isValidTranslation =
    translations[currentLanguage] &&
    typeof translations[currentLanguage] === "object" &&
    translations[currentLanguage] !== null &&
    translations[currentLanguage].greeting;

  // Assegna il saluto, con un fallback a "Ciao" se non è valido
  const greetingText = isValidTranslation
    ? translations[currentLanguage].greeting
    : "Ciao"; // Fallback a "Ciao" se la traduzione non è trovata

  // Recupera gli elementi DOM, assicurandosi che esistano
  const profile = document.getElementById("profile");
  const loginBtn = document.getElementById("loginBtn");
  const totalsBox = document.getElementById("totalsBox");
  const profileName = document.getElementById("profileName");

  if (profile && loginBtn && totalsBox && profileName) {
    if (username) {
      // Combina il saluto tradotto con il nome utente e assegnalo al profilo
      profileName.textContent = `${greetingText} ${sanitizeText(username)}`;

      // Mostra il profilo e nasconde il bottone di login
      profile.style.display = "block";
      loginBtn.style.display = "none";
      totalsBox.style.display = "flex";
totalsBox.style.flexDirection = "row"; // opzionale se serve

    } else {
      // Se non ci sono dati utente, nascondi il profilo e mostra il bottone di login
      profile.style.display = "none";
      loginBtn.style.display = "block";
      totalsBox.style.display = "none";
    }
  } else {
    console.error("Errore: uno o più elementi DOM non sono stati trovati.");
  }
}

// Funzione per "sanitizzare" i dati dell'utente e prevenire potenziali vulnerabilità
function sanitizeText(text) {
  if (text && typeof text === "string") {
    // Crea un elemento DOM temporaneo per sanificare il testo
    const tempElement = document.createElement("div");
    tempElement.textContent = text; // Imposta il testo per l'elemento
    return tempElement.innerHTML; // Ritorna il testo sicuro
  }
  return text; // Se non è una stringa valida, restituisci il testo così com'è
}

// Mostra il pop-up di logout quando clicchi su "Ciao, Nome Utente"
if (profileName) {
  profileName.addEventListener("click", () => {
    openPopup("logoutPopup");
  });
}

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
window.onload = function () {
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
let recentlyDeleted = null; // Memorize the deleted item and quantity

function loadObjects() {
  // Verifica se l'utente è loggato
  if (!localStorage.getItem("loggedIn")) {
    // Se l'utente non è loggato, nascondi la lista degli oggetti
    const objectList = document.getElementById("objectList");
    objectList.innerHTML = ""; // Pulisce la lista degli oggetti
    return; // Non caricare gli oggetti
  }

  // Continuare con il caricamento degli oggetti solo se l'utente è loggato
  const savedObjects = JSON.parse(localStorage.getItem("objects")) || [];
  const today = new Date();
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);

  savedObjects.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

  const objectList = document.getElementById("objectList");
  objectList.innerHTML = "";

  savedObjects.forEach((obj) => {
    const formattedDate = formatDate(obj.expiryDate);

    // Repeat the items based on quantity
    for (let i = 0; i < obj.quantity; i++) {
      const tr = document.createElement("tr");

      const nameTd = document.createElement("td");
      nameTd.textContent = obj.name;
      tr.appendChild(nameTd);

      const expiryTd = document.createElement("td");
      expiryTd.textContent = formattedDate;
      tr.appendChild(expiryTd);

      const expiryDate = new Date(obj.expiryDate);
      // Add class "red" for the items expiring in the next 3 days
      if (expiryDate <= threeDaysLater && expiryDate >= today) {
        tr.classList.add("red");
      }

      // Add class 'red2' for the items that expire today
      if (expiryDate.toDateString() === today.toDateString()) {
        tr.classList.add("red2");
      }

      // If ShowAll is Active, remove calss 'hidden'
      if (showAll) {
        tr.classList.remove("hidden");
      } else {
        if (!tr.classList.contains("red") && !tr.classList.contains("red2")) {
          tr.classList.add("hidden");
        }
      }

      // Creates the delete button
      const deleteTd = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = translations[currentLanguage]["Delete"];
      deleteBtn.classList.add("deleteBtnStyle");
      deleteBtn.onclick = () => deleteObject(obj.id); // ID of the Item
      deleteTd.appendChild(deleteBtn);
      tr.appendChild(deleteTd);

      objectList.appendChild(tr);
    }
  });

  // Shows the button to restore the deleted items if existing
  const undoDiv = document.getElementById("undoDiv");
  if (recentlyDeleted) {
    undoDiv.style.display = "block";
  } else {
    undoDiv.style.display = "none";
  }

  // Loads suggestions
  loadSuggestions();
  updateDeleteButtons();

  updateTotals();
}

// Funzione per suggerire i nomi degli oggetti mentre l'utente digita
function suggestObjectName() {
  const inputField = document.getElementById("objectName");
  const suggestionList = document.getElementById("suggestionList");
  const name = inputField.value.toLowerCase(); // Prendi il nome dell'oggetto inserito

  if (!name) {
    suggestionList.innerHTML = ""; // Se il campo è vuoto, nascondi i suggerimenti
    return;
  }

  const savedObjects = JSON.parse(localStorage.getItem("objects")) || [];

  // Filtra gli oggetti salvati che iniziano con il testo digitato
  const suggestions = savedObjects
    .map((obj) => obj.name) // Ottieni i nomi degli oggetti
    .filter((itemName) => itemName.toLowerCase().includes(name)) // Filtra per il testo digitato
    .slice(0, 5); // Limita i suggerimenti a 5

  suggestionList.innerHTML = ""; // Pulisce la lista dei suggerimenti

  // Aggiungi i suggerimenti nella lista
  suggestions.forEach((itemName) => {
    const li = document.createElement("li");
    li.textContent = itemName;
    li.onclick = () => {
      inputField.value = itemName; // Se l'utente clicca su un suggerimento, lo inserisce nel campo
      suggestionList.innerHTML = ""; // Pulisce i suggerimenti dopo la selezione
    };
    suggestionList.appendChild(li);
  });
}

// Function to add items
function addObject() {
  const name = document.getElementById("objectName").value;
  const expiryDate = document.getElementById("expiryDate").value;
  const quantity = parseInt(document.getElementById("quantity").value, 10) || 1;

  if (!name || !expiryDate) {
    alert("Insert item name and expiry date.");
    return;
  }

  const savedObjects = JSON.parse(localStorage.getItem("objects")) || [];

  // Generates an unique ID for each items
  const newObject = {
    id: Date.now(),
    name,
    expiryDate,
    quantity,
  };

  savedObjects.push(newObject);
  localStorage.setItem("objects", JSON.stringify(savedObjects));

  document.getElementById("objectName").value = "";
  document.getElementById("expiryDate").value = "";
  document.getElementById("quantity").value = "";

  loadObjects();
  // Aggiorna il totale dei prodotti
  updateTotals();
}

// Aggiungi un evento di input per suggerire gli articoli mentre l'utente digita
document
  .getElementById("objectName")
  .addEventListener("input", suggestObjectName);

// Function to format data
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("it-IT");
}

// Function for deleting items.
function deleteObject(id) {
  const savedObjects = JSON.parse(localStorage.getItem("objects")) || [];

  //Finds an item to delete
  const objectToDelete = savedObjects.find((obj) => obj.id === id);
  if (objectToDelete && objectToDelete.quantity > 1) {
    // Memorize the deleted item and quantity
    recentlyDeleted = { ...objectToDelete, quantity: 1 }; // Saves the item to restore with quantity (with quantity 1)

    // Reduce quantity to 1
    objectToDelete.quantity -= 1;

    //  Save the updated array
    localStorage.setItem("objects", JSON.stringify(savedObjects));
    loadObjects();
  } else if (objectToDelete) {
    // If quantity is 1, removes the item
    recentlyDeleted = objectToDelete; // Saves the item to restore
    const updatedObjects = savedObjects.filter((obj) => obj.id !== id);
    localStorage.setItem("objects", JSON.stringify(updatedObjects));
    loadObjects();
    updateTotals();
  }
}

// Function to restore deleted item
function restoreDeletedObject() {
  if (recentlyDeleted) {
    const savedObjects = JSON.parse(localStorage.getItem("objects")) || [];

    // If an item with quantity > 1 is deleted, the item with that quantity is restored
    const objectToRestore = savedObjects.find(
      (obj) => obj.id === recentlyDeleted.id
    );
    if (objectToRestore) {
      objectToRestore.quantity += recentlyDeleted.quantity; // Ripristina la quantità eliminata
    } else {
      // If it doesn't exist, adds the item with its original quantity
      savedObjects.push(recentlyDeleted);
    }

    // Saves the updated array
    localStorage.setItem("objects", JSON.stringify(savedObjects));

    recentlyDeleted = null; // Reset of the variable

    loadObjects();
    // Aggiorna il totale dei prodotti
    updateTotals();
  }
}

// Variabile per memorizzare l'elemento che stiamo aggiungendo
let itemNameToAdd = "";

// Funzione per mostrare la modale con checkbox
function showPriorityAlert(itemName) {
  itemNameToAdd = itemName;

  // 🔁 Applica la traduzione ogni volta che la modale viene mostrata
  updatePriorityModalText();

  // Reset checkbox
  document.getElementById("highPriority").checked = false;
  document.getElementById("mediumPriority").checked = false;

  // Mostra la modale
  document.getElementById("priorityModal").style.display = "block";
}
function updatePriorityModalText() {
  const elements = document.querySelectorAll('#priorityModal [data-translate-key]');
  elements.forEach(el => {
    const key = el.getAttribute('data-translate-key');
    const translation = translations[currentLanguage]?.[key];
    if (translation) {
      el.textContent = translation;
    }
  });
}


// Funzione per chiudere la modale
function closePriorityModal() {
  document.getElementById("priorityModal").style.display = "none"; // Nascondi la modale
}


// Funzione per confermare la priorità
function confirmPriority() {
  let priority = "none"; // Default: nessuna priorità

  // Verifica quali checkbox sono selezionate
  if (document.getElementById("highPriority").checked) {
    priority = "high";
  } else if (document.getElementById("mediumPriority").checked) {
    priority = "medium";
  }

  // Aggiungi l'elemento con la priorità selezionata
  addItemToBuyListWithPriority(itemNameToAdd, priority);
  loadBuyItems(); // Ricarica la lista degli acquisti
  loadSuggestions(); // Ricarica la lista dei suggerimenti
  updateTotals(); // (Assumendo che questa funzione esista)

  closePriorityModal(); // Chiudi la modale
}

// Funzione per aggiungere un elemento alla lista "To Buy" con la priorità
function addItemToBuyListWithPriority(itemName, priority) {
  const savedBuyItems = JSON.parse(localStorage.getItem("buyItems")) || [];

  // Verifica se l'oggetto è già presente nella lista
  const itemExists = savedBuyItems.some((item) => item.name === itemName);
  if (itemExists) {
    alert("Questo oggetto è già presente nella lista!");
    return; // Se l'oggetto è già presente, non lo aggiungere
  }

  // Aggiungi l'oggetto con la priorità selezionata
  savedBuyItems.push({ name: itemName, priority: priority });
  localStorage.setItem("buyItems", JSON.stringify(savedBuyItems));
}



// Funzione per aggiungere un elemento alla lista "To Buy"
function addBuyItem() {
  const buyItemName = document.getElementById("buyItemName").value;
  const inputField = document.getElementById("buyItemName"); // Campo di input
  const itemPriority = document.getElementById("itemPriority").value; // Priorità selezionata

  // Verifica che il campo nome non sia vuoto
  if (!buyItemName) {
    alert("Inserisci il nome dell'oggetto da acquistare");
    return;
  }

  const savedBuyItems = JSON.parse(localStorage.getItem("buyItems")) || [];

  // Verifica se l'oggetto è già presente nella lista
  if (savedBuyItems.some((item) => item.name === buyItemName)) {
    inputField.classList.add("input-error"); // Aggiungi classe di errore se già presente
    return;
  }

  inputField.classList.remove("input-error"); // Rimuovi classe di errore se valido

  // Se la priorità è "none" (nessuna priorità), aggiungi l'oggetto con priorità "none"
  const priority = itemPriority === "none" ? "none" : itemPriority;

  // Aggiungi l'oggetto con la priorità (creiamo un oggetto con nome e priorità)
  savedBuyItems.push({ name: buyItemName, priority: priority });
  localStorage.setItem("buyItems", JSON.stringify(savedBuyItems));

  inputField.value = ""; // Svuota il campo di input
  document.getElementById("itemPriority").value = "none"; // Resetta la priorità a "none"

  loadBuyItems(); // Ricarica gli oggetti
  updateTotals(); // (Assumendo che questa funzione esista, è facoltativa)
}

// Funzione per caricare gli oggetti "To Buy"
function loadBuyItems() {
  const savedBuyItems = JSON.parse(localStorage.getItem("buyItems")) || [];
  const buyItemList = document.getElementById("buyItemList");
  buyItemList.innerHTML = ""; // Pulisce la lista esistente

  // Ordinamento degli oggetti in base alla priorità
  savedBuyItems.sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, none: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Aggiungi gli oggetti alla tabella
  savedBuyItems.forEach((item, index) => {
    const tr = document.createElement("tr");
    const nameTd = document.createElement("td");

    // Se la priorità è alta o media, aggiungi il pallino a sinistra del testo
    if (item.priority !== "none") {
      const prioritySpan = document.createElement("span");
      if (item.priority === "high") {
        prioritySpan.classList.add("priority-text", "high");
        prioritySpan.textContent = "🔴"; // Pallino rosso per alta priorità
      } else if (item.priority === "medium") {
        prioritySpan.classList.add("priority-text", "medium");
        prioritySpan.textContent = "🟡"; // Pallino giallo per priorità media
      }
      nameTd.appendChild(prioritySpan); // Aggiungi il pallino prima del testo
    }
    

    nameTd.appendChild(document.createTextNode(item.name)); // Aggiungi il nome dell'oggetto
    tr.appendChild(nameTd);


    // Pulsante Storage (aggiunto)
    const storageTd = document.createElement("td");
    const storageBtn = document.createElement("button");
    storageBtn.textContent = "✔️";
    storageBtn.classList.add("storageBtnStyle");
    storageBtn.onclick = () => moveToStorage(index);
    storageTd.appendChild(storageBtn);
    tr.appendChild(storageTd);


    // Pulsante per eliminare l'oggetto
    const deleteTd = document.createElement("td");
    const deleteBtn = document.createElement("button");
  // Inserisci l'icona dentro il bottone
deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteBtn.classList.add("deleteBtnStyle");
    deleteBtn.onclick = () => deleteBuyItem(index);
    deleteTd.appendChild(deleteBtn);
    tr.appendChild(deleteTd);

    buyItemList.appendChild(tr);
  });
}


// Funzione per rimuovere un oggetto dalla lista
function deleteBuyItem(index) {
  const savedBuyItems = JSON.parse(localStorage.getItem("buyItems")) || [];
  savedBuyItems.splice(index, 1); // Rimuovi l'elemento all'indice
  localStorage.setItem("buyItems", JSON.stringify(savedBuyItems)); // Salva di nuovo nel localStorage
  loadBuyItems(); // Ricarica la lista aggiornata
  updateTotals(); // (Assumendo che questa funzione esista, è facoltativa)
}

// Funzione per spostare elemento in Storage e rimuoverlo da To Buy
// Funzione per spostare elemento in Storage e rimuoverlo da To Buy
function moveToStorage(index) {
  const savedBuyItems = JSON.parse(localStorage.getItem("buyItems")) || [];
  const storageList = JSON.parse(localStorage.getItem("storageItems")) || [];

  const item = savedBuyItems[index];

  // Mostra il modal
  const modal = document.getElementById("quantityModal");
  const modalText = document.getElementById("modalText");
  const quantityInput = document.getElementById("quantityInput");
  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  confirmBtn.textContent = translations[currentLanguage].confirm;
cancelBtn.textContent = translations[currentLanguage].cancel;


modalText.textContent = translations[currentLanguage].insertQuantity(item.name);

  quantityInput.value = 1;
  modal.style.display = "flex";

  // Funzione per chiudere il modal
  function closeModal() {
    modal.style.display = "none";
    confirmBtn.removeEventListener("click", onConfirm);
    cancelBtn.removeEventListener("click", onCancel);
  }

  function onConfirm() {
    let quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity <= 0) {
      alert(translations[currentLanguage].invalidQuantity);

      return;
    }

    // Aggiorna storage
    const existing = storageList.find(i => i.name.toLowerCase() === item.name.toLowerCase());
    if (existing) {
      existing.quantity += quantity;
    } else {
      storageList.push({ name: item.name, quantity: quantity });
    }

    localStorage.setItem("storageItems", JSON.stringify(storageList));

    // Rimuovi da lista To Buy
    savedBuyItems.splice(index, 1);
    localStorage.setItem("buyItems", JSON.stringify(savedBuyItems));

    loadBuyItems();
    updateTotals?.();

    closeModal();
  }

  function onCancel() {
    closeModal();
  }

  confirmBtn.addEventListener("click", onConfirm);
  cancelBtn.addEventListener("click", onCancel);
}

// Rimuove l'errore di input quando l'utente interagisce con l'input
document.getElementById("buyItemName").addEventListener("focus", function () {
  this.classList.remove("input-error");
});

// Suggested items
const defaultSuggestionsByLanguage = {
  en: [
    "Olive oil",
    "Cherry tomatoes",
    "Salad",
    "Flour",
    "Lettuce",
    "Garlic",
    "Cheese",
    "Milk",
    "Pasta",
    "Meat",
    "Toothpaste",
    "Napkins",
    "Brush",
    "Toilet paper",
    "Detergent",
    "Shampoo",
    "Soap",
    "Laundry bag",
  ],
  it: [
    "Olio d'oliva",
    "Pomodorini",
    "Insalata",
    "Farina",
    "Lattuga",
    "Aglio",
    "Formaggio",
    "Latte",
    "Pasta",
    "Carne",
    "Dentifricio",
    "Tovaglioli",
    "Spazzola",
    "Carta igienica",
    "Detergente",
    "Shampoo",
    "Sapone",
    "Sacca per il lavaggio",
  ],
};

// Funzione per caricare gli oggetti suggeriti
function loadSuggestions() {
  const { savedObjects, savedBuyItems } = loadSavedData();
  const suggestionList = document.getElementById("suggestionList");
  suggestionList.innerHTML = ""; // Pulisce la lista

  const defaultSuggestions = defaultSuggestionsByLanguage[currentLanguage];
  const suggestedItems = new Set(savedBuyItems.map(item => item.name || item)); // supporta oggetti o stringhe

  function generateFrequencyMap(savedObjects) {
    const frequencyMap = new Map();
    savedObjects.forEach(obj => {
      frequencyMap.set(obj.name, (frequencyMap.get(obj.name) || 0) + obj.quantity);
    });
    return frequencyMap;
  }

  const frequencyMap = generateFrequencyMap(savedObjects);

  // Prendi tutti i prodotti salvati (nomi) in un array
  let allItems = Array.from(frequencyMap.keys());

  // Mescola la lista per variare la selezione
  shuffleArray(allItems);

  let suggestionCount = 0;
  const maxSuggestions = 7;
  const usedSuggestions = new Set();

  // Prendi fino a maxSuggestions prodotti non ancora acquistati
  for (let i = 0; i < allItems.length && suggestionCount < maxSuggestions; i++) {
    const itemName = allItems[i];
    if (!suggestedItems.has(itemName) && !usedSuggestions.has(itemName)) {
      createSuggestionItem(itemName, suggestionList);
      usedSuggestions.add(itemName);
      suggestionCount++;
    }
  }

  // Se non abbiamo raggiunto maxSuggestions, aggiungiamo dai suggerimenti di default mescolati
  if (suggestionCount < maxSuggestions) {
    let shuffledDefaults = [...defaultSuggestions];
    shuffleArray(shuffledDefaults);

    for (let itemName of shuffledDefaults) {
      if (suggestionCount >= maxSuggestions) break;
      if (!suggestedItems.has(itemName) && !usedSuggestions.has(itemName)) {
        createSuggestionItem(itemName, suggestionList);
        usedSuggestions.add(itemName);
        suggestionCount++;
      }
    }
  }
}

// Funzione per mescolare array (Fisher-Yates shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


// Function to load saved objects and buy items from localStorage
function loadSavedData() {
  const savedObjects = JSON.parse(localStorage.getItem("objects")) || [];
  const savedBuyItems = JSON.parse(localStorage.getItem("buyItems")) || [];
  return { savedObjects, savedBuyItems };
}

// Funzione per creare un elemento suggerito nella UI
function createSuggestionItem(itemName, suggestionList) {
  const li = document.createElement("li");
  li.textContent = itemName;

  const addBtn = document.createElement("button");
  addBtn.textContent = currentLanguage === "it" ? "Aggiungi" : "Add";
    // Aggiungo una classe CSS personalizzata
  addBtn.classList.add("addBtn");

  addBtn.onclick = () => {
    // Mostra la modale per la selezione della priorità
    showPriorityAlert(itemName);
  };

  li.appendChild(addBtn);
  suggestionList.appendChild(li);
}

// Function to add item to buy list and update localStorage
function addItemToBuyList(itemName) {
  const savedBuyItems = JSON.parse(localStorage.getItem("buyItems")) || [];
  savedBuyItems.push(itemName);
  localStorage.setItem("buyItems", JSON.stringify(savedBuyItems));

  // Clear the input field
  document.getElementById("buyItemName").value = "";
}
const translations = {
  it: {
     insertQuantity: (itemName) => `Inserisci quantità "${itemName}":`,
  invalidQuantity: "Quantità non valida",
    "Dark Mode": "Modalità Scura",
    "Color Picker": "Selettore Colore",
    "Change Color": "Cambia Colore",
    "Background:": "Sfondo:",
    "Text:": "Testo:",
    "Reset Colors": "Ripristina Colori",
    "Show All": "Mostra Tutti",
    Product: "Prodotto",
    Expiry: "Scadenza",
    Delete: "Elimina",
    Storage: 'Inventario',
    "Expiry List": "Lista Scadenze",
    "Shopping List": "Lista della Spesa",
    Suggestions: "Suggerimenti",
    Add: "Aggiungi",
    "Find Items": "Trova Articoli",
    "Add Items": "Inserisci Articoli",
    "Insert item name and expiry date.":
      "Inserisci nome e data di scadenza dell'articolo.",
    "Insert name of the item to buy":
      "Inserisci il nome dell'articolo da comprare",
    Export: "Esporta",
    loginButton: "Accedi",
    greeting: "Ciao, ",
    loginPopupTitle: "Accedi al tuo account",
    usernamePlaceholder: "Nome Utente",
    emailPlaceholder: "Email",
    loginButtonAction: "Accedi",
    logoutConfirmation: "Sei sicuro di voler fare il log out?",
    logoutButton: "Esci",
    Username: "Nome Utente",
    Email: "Email",
    priority: "Priorità",
    "select priority": " Selezione Priorità",
    confirm: "Conferma",
    cancel: "Cancella",
    "high": "Alta 🔴",
    "medium": "Media 🟡",
    ph: "Aggiungi da foto📷 ",
         "loadingMessage": "Caricamento in corso, attendi...",
    "modelNotLoaded": "Modello non ancora caricato, riprova tra un attimo.",
    "scanError": "Errore durante la scansione: ",
  },
  en: {
         insertQuantity: (itemName) => `Enter quantity for "${itemName}":`,
  invalidQuantity: "Invalid quantity",
    "Dark Mode": "Dark Mode",
    "Color Picker": "Color Picker",
    "Change Color": "Change Color",
    "Background:": "Background:",
    "Text:": "Text:",
    "Reset Colors": "Reset Colors",
    "Show All": "Show All",
    Product: "Product",
    Expiry: "Expiry",
    Delete: "Delete",
    Storage: 'Storage',
    "Expiry List": "Expiry List",
    "Shopping List": "Shopping List",
    Suggestions: "Suggestions",
    Add: "Add",
    "Find Items": "Find Items",
    "Add Items": "Add Items",
    "Insert item name and expiry date.": "Insert item name and expiry date.",
    "Insert name of the item to buy": "Insert name of the item to buy",
    Export: "Export",
    loginButton: "Login",
    greeting: "Hello, ",
    loginPopupTitle: "Sign in to your account",
    usernamePlaceholder: "Username",
    emailPlaceholder: "Email",
    loginButtonAction: "Log In",
    logoutConfirmation: "Are you sure you want to log out?",
    logoutButton: "Log Out",
    Username: "Username",
    Email: "Email",
    priority: "Priority",
    "select priority": " Select Priority",
    confirm: "Confirm",
    cancel: "Cancel",
    "high": "High 🔴",
    "medium": "Medium 🟡",
    ph: "Take a Photo📷 ",
         "loadingMessage": "Loading, please wait...",
    "modelNotLoaded": "Model not loaded yet, try again shortly.",
    "scanError": "Error during scan: ",
  },
};
// Definisci le lingue supportate
const supportedLanguages = ["en", "it"];
let currentLanguage = localStorage.getItem("selectedLanguage") || "en";

// Verifica se la lingua selezionata è valida, altrimenti imposta la lingua predefinita
if (!supportedLanguages.includes(currentLanguage)) {
  console.warn(
    `Lingua non valida rilevata in localStorage, uso "en" come predefinito.`
  );
  currentLanguage = "en";
  localStorage.setItem("selectedLanguage", currentLanguage); // Salva la lingua predefinita
}

// Funzione per cambiare la lingua
function changeLanguage(language) {
  // Limita la lingua a quelle supportate
  if (!supportedLanguages.includes(language)) {
    console.warn(
      `Lingua non supportata: ${language}. Uso "en" come lingua di fallback.`
    );
    language = "en"; // Imposta "en" come lingua di fallback
  }

  currentLanguage = language;
  localStorage.setItem("selectedLanguage", language); // Salva la lingua selezionata

  // Cambia l'icona della lingua in base alla lingua selezionata
  updateLanguageIcon(language);

  // Cambia il testo degli elementi sulla pagina
  updatePageText(language);
  updatePriorityModalText();

  // Cambia i placeholder dinamicamente
  updatePlaceholders(language);

  // Ricarica altre informazioni
  loadSuggestions();
  updateDeleteButtons();
  displayProfile();
  updateTotals();
}

// Funzione per cambiare l'icona della lingua
function updateLanguageIcon(language) {
  const languageIcon = document.getElementById("language-icon");
  if (languageIcon) {
    if (language === "it") {
      languageIcon.src =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1500px-Flag_of_Italy.svg.png";
      languageIcon.alt = "Italian Flag";
    } else if (language === "en") {
      languageIcon.src =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/1200px-Flag_of_the_United_Kingdom_%283-5%29.svg.png";
      languageIcon.alt = "English Flag";
    }
  } else {
    console.error('Elemento "language-icon" non trovato.');
  }
}

// Funzione per aggiornare il testo degli elementi sulla pagina
function updatePageText(language) {
  document.querySelectorAll("[data-translate-key]").forEach((element) => {
    const key = element.getAttribute("data-translate-key");

    // Verifica se la lingua selezionata ha le traduzioni
    if (translations[language] && typeof translations[language] === "object") {
      // Verifica se la chiave esiste nelle traduzioni
      if (Object.hasOwn(translations[language], key)) {
        element.textContent = translations[language][key];
      } else {
        console.warn(
          `Chiave di traduzione non trovata per "${key}" in "${language}".`
        );
        element.textContent = `Traduzione mancante per "${key}"`; // Messaggio di fallback
      }
    } else {
      console.error(`Oggetto translations per "${language}" non valido.`);
      element.textContent = `Errore di traduzione per la lingua "${language}"`; // Messaggio di errore
    }
  });
}

// Funzione per aggiornare i placeholder dinamicamente
function updatePlaceholders(language) {
  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.placeholder =
      (translations[language] && translations[language]["Find Items"]) ||
      "Find Items";
  }

  const buyItemInput = document.getElementById("buyItemName");
  if (buyItemInput) {
    buyItemInput.placeholder =
      (translations[language] && translations[language]["Add Items"]) ||
      "Add Items";
  }

  const objectName = document.getElementById("objectName");
  if (objectName) {
    objectName.placeholder =
      (translations[language] && translations[language]["Add"]) || "Aggiungi";
  }

  const usernameInput = document.getElementById("username");
  if (usernameInput) {
    // Verifica che translations[language] sia un oggetto valido e contenga la chiave "Username"
    if (translations[language] && translations[language]["Username"]) {
      usernameInput.placeholder = translations[language]["Username"];
    } else {
      usernameInput.placeholder = "Username"; // Fallback sicuro
    }
  }

  const emailInput = document.getElementById("email");
  if (emailInput) {
    // Verifica che translations[language] sia un oggetto valido e contenga la chiave "Email"
    if (translations[language] && translations[language]["Email"]) {
      emailInput.placeholder = translations[language]["Email"];
    } else {
      emailInput.placeholder = "Email"; // Fallback sicuro
    }
  }
}

// Aggiungi un evento al pulsante di cambio lingua
document
  .getElementById("change-lang-button")
  .addEventListener("click", function () {
    // Cambia la lingua quando l'utente clicca
    const newLanguage = currentLanguage === "it" ? "en" : "it"; // Cambia lingua tra "it" e "en"
    changeLanguage(newLanguage);
  });

// Avvia la lingua iniziale al caricamento del documento
document.addEventListener("DOMContentLoaded", () => {
  changeLanguage(currentLanguage); // Applica la lingua salvata
});

//COUNTER ITEMS
// Funzione per aggiornare i totali dei prodotti nelle due liste
function updateTotals() {
  const savedObjects = JSON.parse(localStorage.getItem("objects")) || [];
  const savedBuyItems = JSON.parse(localStorage.getItem("buyItems")) || [];
   const storageItems = JSON.parse(localStorage.getItem("storageItems")) || [];

  // Conta tutti i prodotti in scadenza (anche quelli non visibili)
  const expiryCount = savedObjects.reduce((count, obj) => {
    const expiryDate = new Date(obj.expiryDate);
    if (expiryDate >= new Date()) {
      count += obj.quantity; // Aggiungi la quantità dell'oggetto
    }
    return count;
  }, 0);

  const buyCount = savedBuyItems.length;
 // Conta la quantità totale nello storage
  const storageCount = storageItems.reduce((total, item) => total + item.quantity, 0);

  // Aggiorna il contatore nella pagina
  document.getElementById("expiryCount").textContent = expiryCount;
  document.getElementById("buyCount").textContent = buyCount;
    document.getElementById("storageCount").textContent = storageCount;
}

// Function for searching the items
function searchObjects() {
  const query = document.getElementById("searchBar").value.toLowerCase();
  const savedObjects = JSON.parse(localStorage.getItem("objects")) || [];
  const objectList = document.getElementById("objectList");
  objectList.innerHTML = "";

  savedObjects.forEach((obj) => {
    if (obj.name.toLowerCase().includes(query)) {
      const formattedDate = formatDate(obj.expiryDate);

      for (let i = 0; i < obj.quantity; i++) {
        const tr = document.createElement("tr");
        const nameTd = document.createElement("td");
        nameTd.textContent = obj.name;
        tr.appendChild(nameTd);

        const expiryTd = document.createElement("td");
        expiryTd.textContent = formattedDate;
        tr.appendChild(expiryTd);

        const deleteTd = document.createElement("td");
        const deleteBtn = document.createElement("button");
       // Inserisci l'icona dentro il bottone
deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteBtn.classList.add("deleteBtnStyle");
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
document
  .getElementById("exportButton")
  .addEventListener("click", exportListAsText);

function exportListAsText() {
  // Recupera le liste salvate nel localStorage
  const savedObjects = JSON.parse(localStorage.getItem("objects")) || [];
  const savedBuyItems = JSON.parse(localStorage.getItem("buyItems")) || [];

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



document
  .getElementById("darkmode-toggle")
  .addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  });

  
  
