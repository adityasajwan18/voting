// Initial Data State
let candidates = [
    { id: 1, name: "Alice Johnson", role: "President", icon: "👩‍💼", votes: 0 },
    { id: 2, name: "Bob Smith", role: "President", icon: "👨‍💼", votes: 0 },
    { id: 3, name: "Charlie Davis", role: "President", icon: "🧑‍💻", votes: 0 }
];

let totalVotes = 0;
let currentUser = null;
let userRole = null; // 'admin' or 'voter'

// Admin credentials (demo)
const adminCredentials = {
    username: "admin",
    password: "admin123"
};

// Initialize the app on page load
window.addEventListener('load', function() {
    // Check if user is already logged in
    const session = sessionStorage.getItem('user');
    if(session) {
        const userData = JSON.parse(session);
        currentUser = userData.name;
        userRole = userData.role;
        showMainContent();
    }
});

// ============= LOGIN FUNCTIONS =============

function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    const errorMsg = document.getElementById('admin-error');
    
    if(username === adminCredentials.username && password === adminCredentials.password) {
        currentUser = username;
        userRole = 'admin';
        
        // Save session
        sessionStorage.setItem('user', JSON.stringify({name: username, role: 'admin'}));
        
        // Clear form
        document.getElementById('admin-username').value = '';
        document.getElementById('admin-password').value = '';
        errorMsg.classList.remove('show');
        
        showMainContent();
        switchPage('admin');
    } else {
        errorMsg.textContent = 'Invalid username or password';
        errorMsg.classList.add('show');
    }
}

function handleVoterLogin(event) {
    event.preventDefault();
    
    const name = document.getElementById('voter-name').value.trim();
    const errorMsg = document.getElementById('voter-error');
    
    if(name.length < 2) {
        errorMsg.textContent = 'Please enter a valid name';
        errorMsg.classList.add('show');
        return;
    }
    
    currentUser = name;
    userRole = 'voter';
    
    // Save session
    sessionStorage.setItem('user', JSON.stringify({name: name, role: 'voter'}));
    
    // Clear form
    document.getElementById('voter-name').value = '';
    errorMsg.classList.remove('show');
    
    showMainContent();
    document.getElementById('voter-name-display').textContent = name;
    switchPage('voting');
}

function logout() {
    sessionStorage.removeItem('user');
    currentUser = null;
    userRole = null;
    
    // Hide main content and show home page
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('navbar').style.display = 'none';
    document.getElementById('home-page').style.display = 'flex';
    
    // Clear forms
    document.getElementById('admin-username').value = 'AnshulNegi';
    document.getElementById('admin-password').value = 'Anshul@1506';
    document.getElementById('voter-name').value = '';
    document.getElementById('admin-error').classList.remove('show');
    document.getElementById('voter-error').classList.remove('show');
}

function showMainContent() {
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('navbar').style.display = 'flex';
    document.getElementById('main-content').style.display = 'block';
    
    if(userRole === 'voter') {
        renderVoterPage();
    } else if(userRole === 'admin') {
        renderAdminPage();
    }
}

// ============= NAVIGATION =============

// Navigation Logic
function switchPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    document.querySelectorAll('.nav-links button:not(.logout-btn)').forEach(b => b.classList.remove('active'));
    
    if(page === 'voting') {
        document.getElementById('voting-page').classList.add('active-page');
        document.getElementById('btn-voting').classList.add('active');
        renderVoterPage();
    } else if(page === 'admin') {
        document.getElementById('admin-page').classList.add('active-page');
        document.getElementById('btn-admin').classList.add('active');
        renderAdminPage();
    }
}

// ============= VOTER PAGE =============

// Render Voter Page
function renderVoterPage() {
    const container = document.getElementById('candidates-container');
    container.innerHTML = '';

    candidates.forEach((candidate, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        // Add a staggered delay to the animation for a cool effect
        card.style.animationDelay = `${index * 0.1}s`; 
        
        card.innerHTML = `
            <div class="card-avatar">${candidate.icon}</div>
            <h3>${candidate.name}</h3>
            <p style="color: var(--text-muted); margin-bottom: 10px;">${candidate.role}</p>
            <button class="vote-btn" onclick="castVote(${candidate.id})">Vote</button>
        `;
        container.appendChild(card);
    });
}

// Cast Vote
function castVote(candidateId) {
    const candidate = candidates.find(c => c.id === candidateId);
    if(candidate) {
        candidate.votes++;
        totalVotes++;
        
        // Show confirmation
        alert(`Thank you, ${currentUser}! Your vote for ${candidate.name} has been recorded.`);
        
        // Disable voting after casting vote
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
    }
}

// ============= ADMIN PAGE =============

// Render Admin Page
function renderAdminPage() {
    const container = document.getElementById('results-container');
    container.innerHTML = '';

    const maxVotes = Math.max(...candidates.map(c => c.votes), 1);

    candidates.forEach((candidate, index) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const percentage = maxVotes > 0 ? (candidate.votes / maxVotes) * 100 : 0;
        
        card.innerHTML = `
            <div class="card-avatar" style="font-size: 2.5rem; margin-bottom: 10px;">${candidate.icon}</div>
            <h3>${candidate.name}</h3>
            <p style="color: var(--text-muted); margin-bottom: 10px;">${candidate.role}</p>
            <div class="vote-count">${candidate.votes}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%">
                    ${percentage > 10 ? Math.round(percentage) + '%' : ''}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Reset System
function resetSystem() {
    if(confirm('Are you sure you want to reset all votes? This action cannot be undone.')) {
        candidates.forEach(c => c.votes = 0);
        totalVotes = 0;
        renderAdminPage();
        alert('All votes have been reset.');
    }
}
function renderAdminPage() {
    const container = document.getElementById('results-container');
    container.innerHTML = '';

    candidates.forEach((candidate, index) => {
        const percentage = totalVotes === 0 ? 0 : Math.round((candidate.votes / totalVotes) * 100);
        
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <h3>${candidate.name}</h3>
            <div style="font-size: 2rem; font-weight: bold; color: var(--accent); margin: 10px 0;">
                ${candidate.votes} <span style="font-size: 1rem; color: var(--text-muted)">votes</span>
            </div>
            <p>${percentage}% of total</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Vote Logic
function castVote(id) {
    const candidate = candidates.find(c => c.id === id);
    if(candidate) {
        candidate.votes++;
        totalVotes++;
        
        // Brief visual feedback
        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = "Vote Cast! ✓";
        btn.style.backgroundColor = "#10b981"; // Green success color
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = "var(--accent)";
        }, 1500);
    }
}

// Admin Reset
function resetSystem() {
    if(confirm("Are you sure you want to delete all voting data?")) {
        candidates.forEach(c => c.votes = 0);
        totalVotes = 0;
        renderAdminPage();
    }
}

// Run on load
init();