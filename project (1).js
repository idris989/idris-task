const loginduyme = document.getElementById('logduyme');
const email = document.getElementById('email');
const password = document.getElementById('password');

loginduyme.addEventListener('click', async function(event) {
    event.preventDefault(); 

    const Daxil_edilen_mail = email.value;
    const Daxil_edilen_Pass = password.value;

    try {
        // 1. CHANGE: Talking to the '/login' route instead of '/signup'
        const response = await fetch('http://localhost:3000/login', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: Daxil_edilen_mail, password: Daxil_edilen_Pass })
        });
        
        const result = await response.json();

        if (response.ok) {
            // 2. CHANGE: Alerting a welcome message with their Database ID
            alert("✅ Welcome back! Your Skater ID is: " + result.user.id);
            console.log("Logged in user:", result.user);
        } else {
            // If the database says "No such user"
            alert("❌ " + result.error);
        }
    } catch (error) {
        alert("Server is not running! Please start server.js first.");
    }
});