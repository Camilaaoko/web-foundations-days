const loadButton = document.getElementById('load-users');
const filterInput = document.getElementById('filter-input');
const statusP = document.getElementById('status');
const usersList = document.getElementById('users-list');

let allUsers = [];

// Render function to display any array of users
function renderUsers(users) {
    usersList.innerHTML = '';
    
    if (users.length === 0) {
        statusP.textContent = "No users match your filter.";
        return;
    } else {
        statusP.textContent = `Showing ${users.length} user(s).`;
    }

    users.forEach(user => {
        const li = document.createElement('li');
        
        const nameEl = document.createElement('strong');
        nameEl.textContent = user.name;
        
        const detailsEl = document.createElement('p');
        detailsEl.textContent = `Email: ${user.email} | City: ${user.address.city} | Company: ${user.company.name}`;
        
        li.appendChild(nameEl);
        li.appendChild(detailsEl);
        usersList.appendChild(li);
    });
}

// Async function to load users from API
async function loadUsers() {
    statusP.textContent = "Loading users...";
    loadButton.disabled = true;

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        allUsers = await response.json();
        renderUsers(allUsers);
    } catch (error) {
        statusP.textContent = `Failed to load users: ${error.message}`;
    } finally {
        loadButton.disabled = false;
    }
}

// Event Listeners
loadButton.addEventListener('click', loadUsers);

filterInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
    );
    renderUsers(filtered);
});