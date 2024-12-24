let player;
let gameArea;
let playerSpeed = 20; // Oyuncunun hareket hızı
let score = 0;
let level = 1;
let gameOver = false; // Oyun durumu
let playerName = ""; // Oyuncu adı
let topScores = []; // Liderlik tablosu

// Oyunun başlatılacağı fonksiyon
document.addEventListener('DOMContentLoaded', () => {
    player = document.getElementById('player');
    gameArea = document.getElementById('game-area');
    const startButton = document.getElementById('start-button');

    // Başlatma butonuna tıklama olayı
    startButton.addEventListener('click', () => {
        startButton.style.display = 'none'; // Butonu gizle
        askPlayerName(); // Oyuncu adını al
        startGame(); // Oyunu başlat
        document.addEventListener('keydown', movePlayer); // Hareket dinleyicisini ekle
    });
});

// Oyuncu adını almak için
function askPlayerName() {
    playerName = prompt("Lütfen adınızı girin:", "Oyuncu");
    if (!playerName) playerName = "Bilinmeyen Oyuncu"; // Boş bırakılırsa varsayılan isim
}

// Oyuncuyu hareket ettirme
function movePlayer(event) {
    if (gameOver) return; // Oyun bitmişse hareket etme
    const key = event.key;
    const playerRect = player.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();

    if (key === 'ArrowLeft' && playerRect.left > gameAreaRect.left) {
        player.style.left = `${player.offsetLeft - playerSpeed}px`;
    } else if (key === 'ArrowRight' && playerRect.right < gameAreaRect.right) {
        player.style.left = `${player.offsetLeft + playerSpeed}px`;
    }
}

// Düşen kutucukları oluştur ve düşür
function startGame() {
    const gameInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(gameInterval); // Oyun bittiğinde kutucuk oluşturmayı durdur
            return;
        }
        spawnFallingItem(); // Yeni bir düşen öğe oluştur
    }, 1090); // Her 1 saniyede bir yeni kutucuk oluştur
}

// Düşen öğeyi oluştur
function spawnFallingItem() {
    let item = document.createElement('div');
    item.classList.add('falling-item');

    // Tehlikeli blok olasılığını, level'a göre dinamik olarak hesapla
    const dangerChance = 0.2 + (level - 1) * 0.10; // Başlangıçta %20, her level'de %10 artar
    const isDangerous = Math.random() < dangerChance; // Tehlikeli blok olasılığı

    if (isDangerous) {
        item.classList.add('dangerous-item'); // Eğer tehlikeli bloksa, sınıf ekle
    } else {
        item.classList.add('normal-item'); // Normal blok
    }

    item.style.left = `${Math.random() * (gameArea.offsetWidth - 50)}px`; // Düşen öğeyi rastgele konumlandır
    gameArea.appendChild(item);

    // Öğeyi aşağıya doğru hareket ettir
    let fallInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(fallInterval);
            return;
        }

        item.style.top = `${item.offsetTop + 5}px`; // 5px her adımda aşağıya kaydır

        // Öğenin alt kısmı ekranın altına geldiğinde
        if (item.offsetTop > gameArea.offsetHeight) {
            clearInterval(fallInterval);
            gameArea.removeChild(item);
        }

        // Çarpışma kontrolü
        const playerRect = player.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        if (checkCollision(playerRect, itemRect)) {
            if (item.classList.contains('dangerous-item')) {
                endGame(); // Tehlikeli bloğa çarptığında oyunu bitir
            } else {
                updateScore(10); // Normal bloğa çarptığında skoru artır
            }
            clearInterval(fallInterval);
            gameArea.removeChild(item);
        }
    }, 20); // Her 20ms'de bir öğeyi düşür
}

// Çarpışma kontrolü
function checkCollision(rect1, rect2) {
    return !(
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom ||
        rect1.right < rect2.left ||
        rect1.left > rect2.right
    );
}

// Puanı güncelle
function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;

    // Seviye atlama
    if (score >= level * 50) { // Her 50 puanda bir seviye atla
        level++;
        document.getElementById('level').textContent = level;
    }
}

// Oyunu bitir
function endGame() {
    gameOver = true;

    // Skoru liderlik tablosuna ekle
    addToLeaderboard(playerName, score);

    // Veritabanına oyuncuyu kaydet
    savePlayerToDatabase(playerName, score);

    // Liderlik tablosunu güncelle
    updateLeaderboardDisplay();

    alert("Yeşil Elmaya dokundunuz! Oyun bitti.");
    // Sayfayı yenilemeden oyunu sıfırla
}

// Veritabanına oyuncuyu kaydet
function savePlayerToDatabase(name, score) {
    fetch('/api/Players/SavePlayer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerName: name, score: score })
    })
        .then(response => {
            if (response.ok) {
                console.log("Oyuncu başarıyla kaydedildi.");
            } else {
                console.error("Oyuncu kaydedilemedi.");
            }
        })
        .catch(error => console.error("Hata: ", error));
}

// Liderlik tablosuna skor ekle
function addToLeaderboard(name, score) {
    topScores.push({ name, score });

    // Skorları sıralayıp en yüksek 10 tanesini tut
    topScores.sort((a, b) => b.score - a.score);
    topScores = topScores.slice(0, 10); // En yüksek 10 skor
}

// Liderlik tablosunu güncelle
function updateLeaderboardDisplay() {
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = ""; // Eski listeyi temizle

    topScores.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
        leaderboard.appendChild(listItem);
    });
}