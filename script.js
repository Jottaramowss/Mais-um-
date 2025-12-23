const canvas = document.getElementById('paint-canvas');
const ctx = canvas.getContext('2d');
const card = document.getElementById('card');
const star = document.getElementById('star-drag');
const overlay = document.getElementById('overlay');

// 1. Engine de Pintura Interativa
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
window.addEventListener('mousemove', (e) => {
    // Efeito Parallax no Cartão
    let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;

    // Cria rastro de tinta
    for (let i = 0; i < 3; i++) {
        particles.push(new PaintStroke(e.x, e.y));
    }
});

class PaintStroke {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.size = Math.random() * 8 + 2;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsl(${Math.random() * 20 + 40}, 80%, 60%)`;
        this.life = 1;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        this.life -= 0.02;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function animate() {
    ctx.fillStyle = 'rgba(5, 11, 26, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
animate();

// 2. Lógica de "Gamificação" (Drag and Drop)
star.addEventListener('dragend', (e) => {
    const cardRect = card.getBoundingClientRect();
    if (e.clientX > cardRect.left && e.clientX < cardRect.right &&
        e.clientY > cardRect.top && e.clientY < cardRect.bottom) {
        unlockRealGift();
    }
});

// Touch para Celular
star.addEventListener('touchmove', (e) => {
    let touch = e.touches[0];
    star.style.left = touch.clientX - 25 + 'px';
    star.style.top = touch.clientY - 25 + 'px';
    
    const cardRect = card.getBoundingClientRect();
    if (touch.clientX > cardRect.left && touch.clientX < cardRect.right) {
        unlockRealGift();
    }
});

function unlockRealGift() {
    overlay.style.opacity = '0';
    card.style.opacity = '1';
    card.style.borderColor = '#f9d71c';
    document.getElementById('secret-message').classList.add('visible');
    document.getElementById('interaction-hint').innerText = "Você iluminou minha noite! ✨";
    star.style.display = 'none';
    
    // Explosão de corações
    for(let i=0; i<50; i++) stitchLove();
}

// 3. Interação com o Stitch
function stitchLove() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = (Math.random() * 100) + 'vw';
    heart.style.bottom = '0';
    heart.style.fontSize = '24px';
    heart.style.zIndex = '1000';
    heart.style.transition = 'all 3s ease-out';
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.style.transform = `translateY(-100vh) scale(2)`;
        heart.style.opacity = '0';
    }, 100);
    
    setTimeout(() => heart.remove(), 3000);
}