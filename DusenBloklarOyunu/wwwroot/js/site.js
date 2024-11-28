let player;
let gameArea;
let playerSpeed = 20; // Oyuncunun hareket hızı
let score = 0;
let level = 1;
let gameOver = false; // Oyun durumu
let playerName = ""; // Oyuncu adı
let topScores = []; // Liderlik tablosu

// Oyun başlatma fonksiyonu
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
        spawnFallingItem();
    }, 1000); // Her 1 saniyede bir yeni kutucuk oluştur
}

function spawnFallingItem() {
    const fallingItem = document.createElement('div');

    // %80 ihtimalle normal blok, %20 ihtimalle tehlikeli blok
    const isDangerous = Math.random() < 0.2;
    fallingItem.classList.add('falling-item');
    if (isDangerous) {
        fallingItem.classList.add('dangerous-item'); // Tehlikeli blok stilini ekle
    }

    // Rastgele yatay pozisyon
    fallingItem.style.left = `${Math.random() * (gameArea.offsetWidth - 30)}px`;
    fallingItem.style.top = `0px`;

    gameArea.appendChild(fallingItem);

    // Düşme animasyonu
    const fallInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(fallInterval);
            return;
        }

        const fallingItemRect = fallingItem.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        // Kutucuk yere ulaştığında
        if (fallingItemRect.top > gameArea.offsetHeight) {
            clearInterval(fallInterval);
            gameArea.removeChild(fallingItem);
        }

        // Kutucuk oyuncuya çarparsa
        if (checkCollision(fallingItemRect, playerRect)) {
            clearInterval(fallInterval);
            gameArea.removeChild(fallingItem);

            if (fallingItem.classList.contains('dangerous-item')) {
                endGame(); // Tehlikeli kutucuksa oyunu bitir
            } else {
                updateScore(10); // Normal kutucuksa puan ekle
            }
        }

        // Aşağıya doğru hareket ettir
        fallingItem.style.top = `${fallingItem.offsetTop + 5}px`;
    }, 30); // 30ms'de bir hareket
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

    // Liderlik tablosunu güncelle
    updateLeaderboardDisplay();

    alert("Tehlikeli bir bloğa dokundunuz! Oyun bitti.");
    location.reload(); // Sayfayı yenileyerek oyunu sıfırla
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
