    
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
                deleteBtn.textContent = 'Elimina';
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
    }

    // Function to add items
    function addObject() {
        const name = document.getElementById('objectName').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const quantity = parseInt(document.getElementById('quantity').value) || 1;

        if (!name || !expiryDate) {
            alert("Inserisci sia il nome che la data di scadenza.");
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
            alert("Inserisci il nome dell'oggetto da acquistare.");
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
            deleteBtn.textContent = 'Elimina';
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

   // Function to load suggestions
   function loadSuggestions() {
    const savedObjects = JSON.parse(localStorage.getItem('objects')) || [];
    const savedBuyItems = JSON.parse(localStorage.getItem('buyItems')) || [];
    const suggestionList = document.getElementById('suggestionList');
    suggestionList.innerHTML = ''; // Clears the suggestion list before loading it

    // List of default suggestions when no items are in the lists
    const defaultSuggestions = [
        'Olio d\'oliva', 'Pomodorini', 'Insalata', 'Farina', 'Lattuga', 'Aglio', 'Formaggio', 'Latte', 'Pasta', 'Carne', 
        'Dentifricio', 'Tovaglioli', 'Spazzola', 'Carta igienica', 'Detergente', 'Shampoo', 'Sapone', 'Sacca per il lavaggio'
    ];

    // If no items in savedObjects and savedBuyItems, suggest the default suggestions
    if (savedObjects.length === 0 && savedBuyItems.length === 0) {
        defaultSuggestions.forEach(itemName => {
            if (!savedBuyItems.includes(itemName)) {
                const li = document.createElement('li');
                li.textContent = itemName;

                const addBtn = document.createElement('button');
                addBtn.textContent = 'Aggiungi';
                addBtn.onclick = () => addBuyItemFromSuggestion(itemName);

                li.appendChild(addBtn);
                suggestionList.appendChild(li);
            }
        });
        return; // Exit the function once default suggestions are shown
    }

    // Creates a set to avoid duplicates
    const suggestedItems = new Set();

    // Create a frequency map to track how often each item appears in all categories (food and non-food)
    const frequencyMap = savedObjects.reduce((acc, obj) => {
        if (!acc[obj.name]) {
            acc[obj.name] = 0;
        }
        acc[obj.name] += obj.quantity; // Add the quantity to the frequency count
        return acc;
    }, {});

    // Sort the items based on frequency (most frequent first)
    const sortedItems = Object.keys(frequencyMap).sort((a, b) => frequencyMap[b] - frequencyMap[a]);

    // Suggest items based on frequency, avoiding already bought or suggested items
    let suggestionCount = 0;
    sortedItems.forEach((itemName) => {
        if (suggestionCount >= 7) return; // Limit to 7 suggestions

        // Verify that the item isn't already added or suggested
        if (!savedBuyItems.includes(itemName) && !suggestedItems.has(itemName)) {
            const li = document.createElement('li');
            li.textContent = itemName;

            // Creates the button to add an item to the list
            const addBtn = document.createElement('button');
            addBtn.textContent = 'Aggiungi';
            addBtn.onclick = () => {
                addBuyItemFromSuggestion(itemName); // Add item to the buy list
                loadSuggestions(); // Refresh the suggestions list after adding the item
            };

            li.appendChild(addBtn);
            suggestionList.appendChild(li);

            // Add the item to the set to avoid duplicates in suggestions
            suggestedItems.add(itemName);
            suggestionCount++;
        }
    });

    // If there are not enough suggestions based on frequency, fill the gap with default suggestions
    if (suggestionCount < 7) {  // If less than 7 suggestions were added
        defaultSuggestions.forEach(itemName => {
            if (suggestionCount >= 7) return; // Stop once 7 suggestions are reached

            if (!savedBuyItems.includes(itemName) && !suggestedItems.has(itemName)) {
                const li = document.createElement('li');
                li.textContent = itemName;

                const addBtn = document.createElement('button');
                addBtn.textContent = 'Aggiungi';
                addBtn.onclick = () => {
                    addBuyItemFromSuggestion(itemName); // Add item to the buy list
                    loadSuggestions(); // Refresh the suggestions list after adding the item
                };

                li.appendChild(addBtn);
                suggestionList.appendChild(li);

                // Add the item to the set to avoid duplicates in suggestions
                suggestedItems.add(itemName);
                suggestionCount++;
            }
        });
    }
}


    // Function to add a suggested item on the list "to buy"
    function addBuyItemFromSuggestion(itemName) {
        const savedBuyItems = JSON.parse(localStorage.getItem('buyItems')) || [];

        // Adds the item on the list if it isn't already existing
        if (!savedBuyItems.includes(itemName)) {
            savedBuyItems.push(itemName);
            localStorage.setItem('buyItems', JSON.stringify(savedBuyItems));
        }

        loadBuyItems();
        loadSuggestions(); // Refrest the suggestion list
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

 // JavaScript to toggle the sidebar
 document.getElementById("show").addEventListener("click", function() {
    var customBox = document.getElementById("customBox");
    customBox.classList.toggle("active");
});