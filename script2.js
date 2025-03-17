
// Quiz Form Handler
document.getElementById('quizForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        document.getElementById('quizResult').innerHTML = `
            <div class="alert ${result.risk === 'High' ? 'alert-warning' : 'alert-success'}">
                Risk Level: ${result.risk}
                <p>${result.message}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
    }
});

// Mood Tracker
let moodChart;
const setupMoodChart = () => {
    const ctx = document.getElementById('moodChart').getContext('2d');
    moodChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Mood History',
                data: [],
                borderColor: '#ff69b4',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });
};

document.querySelectorAll('.mood-btn').forEach(button => {
    button.addEventListener('click', async () => {
        const mood = button.dataset.mood;
        try {
            await fetch('/api/mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood })
            });
            updateMoodChart();
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

const updateMoodChart = async () => {
    try {
        const response = await fetch('/api/mood');
        const data = await response.json();
        moodChart.data.labels = data.dates;
        moodChart.data.datasets[0].data = data.moods;
        moodChart.update();
    } catch (error) {
        console.error('Error:', error);
    }
};

// Journal
document.getElementById('journalForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('journalTitle').value;
    const content = document.getElementById('journalContent').value;
    
    try {
        await fetch('/api/journal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
        loadJournalEntries();
        e.target.reset();
    } catch (error) {
        console.error('Error:', error);
    }
});

const loadJournalEntries = async () => {
    try {
        const response = await fetch('/api/journal');
        const entries = await response.json();
        document.getElementById('journalEntries').innerHTML = entries.map(entry => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${entry.title}</h5>
                    <p class="card-text">${entry.content}</p>
                    <small class="text-muted">${new Date(entry.date).toLocaleDateString()}</small>
                    <button class="btn btn-danger btn-sm float-end" onclick="deleteEntry('${entry.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
    }
};

const deleteEntry = async (id) => {
    try {
        await fetch(`/api/journal/${id}`, { method: 'DELETE' });
        loadJournalEntries();
    } catch (error) {
        console.error('Error:', error);
    }
};

// Load Articles
const loadArticles = async () => {
    try {
        const response = await fetch('/api/articles');
        const articles = await response.json();
        document.getElementById('articlesList').innerHTML = articles.map(article => `
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.description}</p>
                        <a href="${article.link}" class="btn btn-primary" target="_blank">Read More</a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
    }
};

// Consultation Form
document.getElementById('consultationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        await fetch('/api/consultation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        alert('Consultation booked successfully!');
        e.target.reset();
    } catch (error) {
        console.error('Error:', error);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupMoodChart();
    loadJournalEntries();
    loadArticles();
});
