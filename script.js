// ڕێکخستنی Firebase (کۆدی خۆت لێرە دابنێ)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "ID",
    appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// گۆڕاوەکان
let coins = 0;
let energy = 1000;
const maxEnergy = 1000;
const userId = "user_1"; // دەتوانی مۆبایل یان ئایدی تێلیگرام بەکاربهێنی

// خوێندنەوەی داتا لە فایەربەیس
database.ref('users/' + userId).on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        coins = data.coins || 0;
        document.getElementById('score').innerText = coins.toLocaleString();
    }
});

// کلیک کردن بۆ ماینینگ
const mineButton = document.getElementById('mine-button');
mineButton.addEventListener('click', (e) => {
    if (energy > 0) {
        coins++;
        energy -= 1;
        updateUI();
        saveToFirebase();
        
        // دروستکردنی ئەنیمەیشنی ژمارە +1
        showClickAnim(e);
    }
});

function updateUI() {
    document.getElementById('score').innerText = coins.toLocaleString();
    document.getElementById('energy-val').innerText = `${energy}/${maxEnergy}`;
    const percent = (energy / maxEnergy) * 100;
    document.getElementById('energy-fill').style.width = percent + "%";
    document.getElementById('energy-percent').innerText = Math.floor(percent) + "%";
}

function saveToFirebase() {
    database.ref('users/' + userId).set({
        coins: coins,
        lastUpdate: Date.now()
    });
}

// زیادکردنی ووزە بە شێوەی ئۆتۆماتیکی
setInterval(() => {
    if (energy < maxEnergy) {
        energy += 1;
        updateUI();
    }
}, 2000);

function showClickAnim(e) {
    const text = document.createElement('div');
    text.innerText = "+1";
    text.style.position = "absolute";
    text.style.left = e.clientX + "px";
    text.style.top = e.clientY + "px";
    text.style.color = "#ffd700";
    text.style.fontWeight = "bold";
    text.style.pointerEvents = "none";
    text.style.animation = "floatUp 0.5s ease-out forwards";
    document.body.appendChild(text);
    setTimeout(() => text.remove(), 500);
}