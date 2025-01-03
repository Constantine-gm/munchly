
    let showAll = false;
    let recentlyDeleted = null;  // Memorizza l'oggetto e la quantità eliminata

    // Funzione per caricare gli oggetti
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

            // Ripeti l'oggetto in base alla quantità
            for (let i = 0; i < obj.quantity; i++) {
                const tr = document.createElement('tr');
                
                const nameTd = document.createElement('td');
                nameTd.textContent = obj.name;
                tr.appendChild(nameTd);

                const expiryTd = document.createElement('td');
                expiryTd.textContent = formattedDate;
                tr.appendChild(expiryTd);

                const expiryDate = new Date(obj.expiryDate);
                // Aggiungi la classe 'red' per gli oggetti che scadono tra oggi e i prossimi 3 giorni
                if (expiryDate <= threeDaysLater && expiryDate >= today) {
                    tr.classList.add('red');
                }

                // Aggiungi la classe 'red2' per gli oggetti che scadono oggi
                if (expiryDate.toDateString() === today.toDateString()) {
                    tr.classList.add('red2');
                }

                // Se "showAll" è attivo, rimuove la classe 'hidden'
                if (showAll) {
                    tr.classList.remove('hidden');
                } else {
                    if (!tr.classList.contains('red') && !tr.classList.contains('red2')) {
                        tr.classList.add('hidden');
                    }
                }

                // Crea il pulsante di eliminazione
                const deleteTd = document.createElement('td');
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Elimina';
                deleteBtn.classList.add('deleteBtnStyle');
                deleteBtn.onclick = () => deleteObject(obj.id); // Passiamo l'ID dell'oggetto
                deleteTd.appendChild(deleteBtn);
                tr.appendChild(deleteTd);

                objectList.appendChild(tr);
            }
        });

        // Mostra il pulsante per ripristinare l'oggetto eliminato se esiste
        const undoDiv = document.getElementById('undoDiv');
        if (recentlyDeleted) {
            undoDiv.style.display = 'block';
        } else {
            undoDiv.style.display = 'none';
        }
    }

    // Funzione per aggiungere oggetti
    function addObject() {
        const name = document.getElementById('objectName').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const quantity = parseInt(document.getElementById('quantity').value) || 1;

        if (!name || !expiryDate) {
            alert("Inserisci sia il nome che la data di scadenza.");
            return;
        }

        const savedObjects = JSON.parse(localStorage.getItem('objects')) || [];

        // Genera un ID univoco per ogni oggetto
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

    // Funzione per formattare la data
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT');
    }

    // Funzione per eliminare un oggetto
    function deleteObject(id) {
        const savedObjects = JSON.parse(localStorage.getItem('objects')) || [];

        // Trova l'oggetto da eliminare
        const objectToDelete = savedObjects.find(obj => obj.id === id);
        if (objectToDelete && objectToDelete.quantity > 1) {
            // Memorizziamo l'oggetto eliminato e la quantità modificata
            recentlyDeleted = { ...objectToDelete, quantity: 1 }; // Salviamo l'oggetto da ripristinare (con quantità 1)
            
            // Diminuiamo la quantità di 1
            objectToDelete.quantity -= 1;

            // Salviamo l'array aggiornato
            localStorage.setItem('objects', JSON.stringify(savedObjects));
            loadObjects();
        } else if (objectToDelete) {
            // Se la quantità è 1, rimuoviamo completamente l'oggetto
            recentlyDeleted = objectToDelete; // Salviamo l'oggetto da ripristinare
            const updatedObjects = savedObjects.filter(obj => obj.id !== id);
            localStorage.setItem('objects', JSON.stringify(updatedObjects));
            loadObjects();
        }
    }

    // Funzione per ripristinare l'oggetto eliminato
    function restoreDeletedObject() {
        if (recentlyDeleted) {
            const savedObjects = JSON.parse(localStorage.getItem('objects')) || [];

            // Se è stato eliminato un oggetto con quantità > 1, ripristiniamo la quantità
            const objectToRestore = savedObjects.find(obj => obj.id === recentlyDeleted.id);
            if (objectToRestore) {
                objectToRestore.quantity += recentlyDeleted.quantity; // Ripristina la quantità eliminata
            } else {
                // Se non esiste, aggiungiamo l'oggetto con la quantità originaria
                savedObjects.push(recentlyDeleted);
            }

            // Salviamo l'array aggiornato
            localStorage.setItem('objects', JSON.stringify(savedObjects));

            recentlyDeleted = null; // Reset della variabile

            loadObjects();
        }
    }

    // Funzione per cercare oggetti
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
                    deleteBtn.textContent = 'Elimina';
                    deleteBtn.classList.add('deleteBtnStyle');
                    deleteBtn.onclick = () => deleteObject(obj.id);
                    deleteTd.appendChild(deleteBtn);
                    tr.appendChild(deleteTd);

                    objectList.appendChild(tr);
                }
            }
        });
    }

    // Funzione per attivare/disattivare la visualizzazione di tutti gli oggetti
    function toggleShowAll() {
        showAll = !showAll;
        loadObjects();
    }

    // Funzione per aggiungere un oggetto alla lista degli acquisti
    function addBuyItem() {
        const buyItemName = document.getElementById('buyItemName').value;

        if (!buyItemName) {
            alert("Inserisci il nome dell'oggetto da acquistare.");
            return;
        }

        const savedBuyItems = JSON.parse(localStorage.getItem('buyItems')) || [];
        savedBuyItems.push(buyItemName);

        localStorage.setItem('buyItems', JSON.stringify(savedBuyItems));

        document.getElementById('buyItemName').value = '';

        loadBuyItems();
    }

    // Funzione per caricare gli articoli da comprare
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
            deleteBtn.textContent = 'Elimina';
            deleteBtn.classList.add('deleteBtnStyle');
            deleteBtn.onclick = () => deleteBuyItem(index);
            deleteTd.appendChild(deleteBtn);
            tr.appendChild(deleteTd);

            buyItemList.appendChild(tr);
        });
    }

    // Funzione per eliminare un oggetto dalla lista degli acquisti
    function deleteBuyItem(index) {
        const savedBuyItems = JSON.parse(localStorage.getItem('buyItems')) || [];
        savedBuyItems.splice(index, 1);
        localStorage.setItem('buyItems', JSON.stringify(savedBuyItems));

        loadBuyItems();
    }

    // Carica oggetti e articoli da acquistare all'avvio della pagina
    loadObjects();
    loadBuyItems();

//Color Picker
    // Funzione per applicare i colori scelti
function applyColors() {
    const backgroundColor = document.getElementById('background-color').value;
    const textColor = document.getElementById('text-color').value;

    // Cambia il colore di sfondo di header e th
    document.querySelector('header').style.backgroundColor = backgroundColor;
    const thElements = document.querySelectorAll('th');
    thElements.forEach(th => {
        th.style.backgroundColor = backgroundColor;
    });

    // Cambia il colore del testo di th e titolo
    thElements.forEach(th => {
        th.style.color = textColor;
    });
    document.querySelector('.title').style.color = textColor;
}

// Funzione per resettare i colori ai valori di default
function resetColors() {
    document.getElementById('background-color').value = "#5bb1c2";
    document.getElementById('text-color').value = "#ffffff";

    // Ripristina i colori predefiniti nell'elemento header e th
    document.querySelector('header').style.backgroundColor = "#5bb1c2";
    const thElements = document.querySelectorAll('th');
    thElements.forEach(th => {
        th.style.backgroundColor = "#5bb1c2";
        th.style.color = "#ffffff";
    });

    // Ripristina il colore del titolo
    document.querySelector('.title').style.color = "#ffffff";
}

// Aggiungi event listeners ai color picker per applicare i cambiamenti
document.getElementById('background-color').addEventListener('input', applyColors);
document.getElementById('text-color').addEventListener('input', applyColors);

// Aggiungi event listener al bottone di reset
document.getElementById('reset-btn').addEventListener('click', resetColors);

  document.getElementById('darkmode-toggle').addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

document.getElementById('show').addEventListener('click', function() {
    const customBox = document.getElementById('customBox');
    // Alterna la visibilità di #customBox tra 'block' e 'none'
    if (customBox.style.display === 'none' || customBox.style.display === '') {
        customBox.style.display = 'block'; // Mostra il box
    } else {
        customBox.style.display = 'none'; // Nasconde il box
    }
});
