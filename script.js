const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const confettiColors = ['#ff0', '#ff8c00', '#ff1493', '#00ff00', '#1e90ff', '#ff4500'];
let fireworksArray = [];
let confettiArray = [];
let gravity = 0.2; // Gravidade para queda dos confetes
const maxFallSpeed = 3; // Velocidade máxima de queda
const backgroundMusic = document.getElementById('backgroundMusic'); // Música de fundo

// Classe de fogos de artifício (foguete)
class Firework {
  constructor(x, targetY, isLarge) {
    this.x = x;
    this.y = canvas.height; // Começa no chão
    this.targetY = targetY; // Ponto no céu onde explode
    this.speedY = -5 - Math.random() * 3; // Velocidade de subida
    this.isLarge = isLarge; // Determina se será uma explosão grande
    this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    this.audio = this.playFireworkSound(); // Toca o som de foguete ao ser lançado
  }

  update() {
    this.y += this.speedY; // Sobe em direção ao ponto de explosão
    if (this.y <= this.targetY) {
      this.explode(); // Explode ao atingir o ponto
      return true; // Indica que o foguete deve ser removido
    }
    return false;
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2); // Desenha o foguete como um pequeno círculo
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  explode() {
    this.audio.pause(); // Para o som de foguete subindo
    this.audio.currentTime = 0; // Reseta o som
    playExplosionSound(this.isLarge ? 0.2 : 0.1); // Toca som de explosão com volume ajustado
    createExplosion(this.x, this.y, this.isLarge); // Cria confetes no ponto de explosão
  }

  playFireworkSound() {
    const fireworkSound = document.createElement('audio');
    fireworkSound.src = 'firework-launch.mp3'; // Som do foguete subindo
    fireworkSound.volume = 0.8; // Ajuste o volume conforme necessário
    fireworkSound.play();
    document.body.appendChild(fireworkSound);

    // Remove o elemento de áudio automaticamente ao terminar
    fireworkSound.addEventListener('ended', () => {
      fireworkSound.remove();
    });

    return fireworkSound;
  }
}

// Classe de confetes
class Confetti {
  constructor(x, y, explosionCenterX, explosionCenterY) {
    const angle = Math.random() * Math.PI * 2; // Ângulo aleatório para dispersão circular
    const speed = Math.random() * 3 + 1; // Velocidade radial reduzida (raio menor)
    this.x = explosionCenterX;
    this.y = explosionCenterY;
    this.size = Math.random() * 8 + 3; // Tamanho do confete
    this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    this.speedX = Math.cos(angle) * speed; // Velocidade horizontal com base no ângulo
    this.speedY = Math.sin(angle) * speed; // Velocidade vertical com base no ângulo
    this.rotationSpeed = Math.random() * 10 - 5;
    this.falling = false; // Indica se está na fase de queda
  }

  update() {
    if (!this.falling) {
      // Fase de explosão
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += gravity * 0.2; // Gravidade reduzida durante explosão
      if (Math.hypot(this.speedX, this.speedY) < 1.5) {
        this.falling = true; // Transição para a fase de queda
      }
    } else {
      // Fase de queda
      this.x += this.speedX;
      this.y += Math.min(this.speedY + gravity, maxFallSpeed);
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size); // Desenha quadrado
    ctx.restore();
  }
}

// Função para tocar o som de explosão
function playExplosionSound(volume = 0.2) {
  const explosionSound = document.createElement('audio'); // Cria elemento <audio>
  explosionSound.src = 'explosion.mp3'; // Fonte do som de explosão
  explosionSound.volume = volume; // Ajusta o volume da explosão (0.0 a 1.0)
  explosionSound.play(); // Toca o som

  // Remove o elemento <audio> após o término do som
  explosionSound.addEventListener('ended', () => {
    explosionSound.remove();
  });

  document.body.appendChild(explosionSound);
}

// Cria confetes para uma explosão em um ponto
function createExplosion(x, y, isLarge) {
  const numConfetti = isLarge 
    ? Math.floor(Math.random() * 100 + 200) // Explosão grande (200 a 300 confetes)
    : Math.floor(Math.random() * 70 + 30); // Explosão normal (30 a 100 confetes)

  for (let i = 0; i < numConfetti; i++) {
    const confetti = new Confetti(x, y, x, y);
    confettiArray.push(confetti);
  }
}

// Gera múltiplos fogos saindo do chão
function startFireworks() {
  setInterval(() => {
    const x = Math.random() * canvas.width; // Posição X aleatória no chão
    const targetY = Math.random() * canvas.height * 0.5; // Posição Y no céu
    const isLarge = Math.random() < 0.3; // 30% de chance de ser uma explosão grande
    fireworksArray.push(new Firework(x, targetY, isLarge));
  }, 500); // Novo foguete a cada 500ms
}

// Animação
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Atualiza e desenha fogos
  fireworksArray = fireworksArray.filter((firework) => {
    firework.draw();
    return !firework.update(); // Remove fogos que já explodiram
  });

  // Atualiza e desenha confetes
  confettiArray.forEach((confetti) => {
    confetti.update();
    confetti.draw();
  });

  animationFrame = requestAnimationFrame(animate);
}

// Inicia o show de fogos
function startShow() {
  // backgroundMusic.play(); // Toca a música
  startFireworks(); // Começa os fogos saindo do chão
  animate();
}

startShow();

const typingText = [
  "Amigos, que o novo ano seja repleto de momentos inesquecíveis ao nosso lado. Que não nos faltem risadas, aventuras e muito companheirismo!",
  "Que cada dia de 2024 traga novas conquistas e ainda mais união entre a nossa turma. Vocês são parte essencial da minha felicidade.",
  "Neste ano que chega, desejo que nossa amizade se fortaleça ainda mais. Que continuemos celebrando juntos cada vitória e apoiando nos momentos difíceis.",
  "A cada novo ciclo, lembro o quanto sou grato(a) por ter amigos tão especiais ao meu lado. Que 2024 seja um ano de muitas histórias para compartilharmos.",
  "Para os amigos que alegram minha vida: que o ano novo seja cheio de alegrias, sonhos realizados e muita esperança em nossos corações. Feliz 2024!",
  "Feliz ano novo!"
];

const typingElement = document.getElementById("typingEffect");
let currentParagraph = 0;
let currentChar = 0;

function typeText() {
  if (currentParagraph < typingText.length) {
    const currentText = typingText[currentParagraph];

    if (currentChar < currentText.length) {
      typingElement.innerHTML += currentText[currentChar];
      currentChar++;
      setTimeout(typeText, 50); // Velocidade da digitação
    } else {
      // Parágrafo concluído
      currentParagraph++;
      currentChar = 0;
      typingElement.innerHTML += "<br><br>"; // Adiciona espaço entre os parágrafos
      setTimeout(typeText, 500); // Pausa entre parágrafos
    }
  }
}

// Iniciar o efeito de máquina de escrever
typeText();
