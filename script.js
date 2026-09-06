const CORRECT_PASSWORD = "anilu100903";

const passwordForm = document.getElementById("passwordForm");
const enterButton = document.getElementById("enterButton");
const passwordInput = document.getElementById("passwordInput");
const feedback = document.getElementById("feedback");
const lockCard = document.getElementById("lockCard");
const lockIcon = document.getElementById("lockIcon");
const successOverlay = document.getElementById("successOverlay");
const togglePassword = document.getElementById("togglePassword");
const continueButton = document.getElementById("continueButton");

const hints = [
  document.getElementById("hint1"),
  document.getElementById("hint2"),
  document.getElementById("hint3"),
  document.getElementById("hint4")
];

let attempts = 0;
let passwordVisible = false;

function normalize(value) {
  return value.trim().toLowerCase();
}

function showFeedback(hint, comment) {
  feedback.innerHTML = `
    <span class="feedback-hint">💡 ${hint}</span>
    <span class="feedback-comment">💗 ${comment}</span>
  `;
}

function revealHint(number) {
  const hint = hints[number - 1];
  if (hint) {
    hint.classList.remove("hidden");
  }
}

function clearFeedback() {
  feedback.innerHTML = "";
}

function shakeCard() {
  lockCard.classList.remove("shake");
  void lockCard.offsetWidth;
  lockCard.classList.add("shake");
}

function checkPassword(event) {
  if (event) event.preventDefault();

  const entered = normalize(passwordInput.value);

  // Conserva el estado elegido por la usuaria (visible u oculta).
  const restorePasswordVisibility = () => {
    passwordInput.type = passwordVisible ? "text" : "password";
    togglePassword.textContent = "♡";
  };

  if (!entered) {
    showFeedback(
      "Primero tienes que intentar descubrirla... 👀",
      "Vamos mi amor, tú puedes. ❤️"
    );
    shakeCard();
    restorePasswordVisibility();
    return;
  }

  if (entered === CORRECT_PASSWORD) {
    unlock();
    setTimeout(restorePasswordVisibility, 0);
    return;
  }

  attempts++;
  shakeCard();

  /*
    La pista inicial (1) ya está visible al entrar.
    Después de cada intento fallido se revela la siguiente: 
    intento 1 -> pista 2
    intento 2 -> pista 3
    intentos 3-5 -> sigue visible la pista 3
    intento 6+ -> pista 4
  */
  if (attempts === 1) revealHint(2);
  else if (attempts === 2) revealHint(3);
  else if (attempts >= 6) revealHint(4);

  // Los comentarios especiales sí dependen de lo que haya escrito.
  if (entered === "anilu") {
    showFeedback(
      "Encontraste una parte... pero una contraseña tan importante no podía ser tan cortita, ¿no? 👀",
      "Encontraste una parte, mi amor, sigue intentando. ❤️"
    );
  } else if (entered === "100903") {
    showFeedback(
      "También encontraste una parte... pero todavía falta saber de quién estamos hablando. ❤️",
      "No podía ser tan corto, ¿verdad? 👀"
    );
  } else if (
    entered === "anita100903" ||
    entered === "princesaanita" ||
    entered === "anita"
  ) {
    showFeedback(
      "Estás cerca. Hay un nombre que alguien de tu familia te decía de una manera muy especial... 👀",
      "Estas cerca mi amor pero hay un nombre mas especial"
    );
  } else if (entered === "ana100903" || entered === "ana") {
    showFeedback(
      "Estás cerca... pero hay alguien de tu familia que te llamó de una manera muy especial. ¿Recuerdas?",
      "Sigue buscando mi amor, estoy segura de que lo recuerdas. 🥰"
    );
  } else {
    showFeedback(
      "Recuerda que todas las respuestas están relacionadas contigo. ❤️",
      "Sigue las pistas mi niña, estás a punto de lograrlo. 🥰"
    );
  }

  passwordInput.select();
  setTimeout(restorePasswordVisibility, 0);
}

function unlock() {
  clearFeedback();
  passwordInput.blur();

  lockIcon.textContent = "🔓";

  createHeartBurst();

  setTimeout(() => {
    successOverlay.classList.add("show");
  }, 450);
}

function createHeartBurst() {
  const hearts = ["♥", "♡", "❤", "💕", "✨"];

  for (let i = 0; i < 18; i++) {
    const heart = document.createElement("span");
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.position = "fixed";
    heart.style.left = "50%";
    heart.style.top = "48%";
    heart.style.zIndex = "30";
    heart.style.pointerEvents = "none";
    heart.style.color = "#df7fa5";
    heart.style.fontSize = `${14 + Math.random() * 20}px`;
    heart.style.transition = "transform 1s ease-out, opacity 1s ease-out";

    document.body.appendChild(heart);

    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 220;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    requestAnimationFrame(() => {
      heart.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 180 - 90}deg)`;
      heart.style.opacity = "0";
    });

    setTimeout(() => heart.remove(), 1100);
  }
}

togglePassword.addEventListener("click", (event) => {
  event.preventDefault();
  passwordVisible = !passwordVisible;
  passwordInput.type = passwordVisible ? "text" : "password";
  togglePassword.textContent = "♡";
  passwordInput.focus();
});

enterButton.addEventListener("click", checkPassword);

// También permite enviar la contraseña presionando Enter desde el teclado.
passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    checkPassword(event);
  }
});

const letterScene = document.getElementById("letterScene");
const envelopeStage = document.getElementById("envelopeStage");
const envelope = document.getElementById("envelope");
const openLetterButton = document.getElementById("openLetterButton");
const letterPaper = document.getElementById("letterPaper");
const confettiContainer = document.getElementById("confettiContainer");

continueButton.addEventListener("click", (event) => {
  event.preventDefault();
  successOverlay.classList.remove("show");
  setTimeout(() => {
    successOverlay.style.display = "none";
    letterScene.classList.add("show");
    letterScene.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
  }, 400);
});

openLetterButton.addEventListener("click", () => {
  envelope.classList.add("open");
  openLetterButton.disabled = true;
  openLetterButton.textContent = "Tu carta está abriéndose... 💗";

  // El audio se prepara dentro del clic del usuario para evitar bloqueos del navegador.
  startConfettiSound();

  setTimeout(() => {
    envelopeStage.style.display = "none";
    letterPaper.classList.add("show");
    launchConfetti();
  }, 1050);
});

let confettiAudioContext = null;

function startConfettiSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!confettiAudioContext) {
      confettiAudioContext = new AudioContextClass();
    }

    const ctx = confettiAudioContext;
    const schedule = () => scheduleConfettiSound(ctx, ctx.currentTime + 1.05);

    if (ctx.state === "suspended") {
      const resumed = ctx.resume();
      if (resumed && typeof resumed.then === "function") {
        resumed.then(schedule).catch(() => {});
      } else {
        schedule();
      }
    } else {
      schedule();
    }
  } catch (error) {
    // El efecto visual funciona aunque el navegador bloquee el audio.
  }
}

function scheduleConfettiSound(ctx, startAt) {
  try {
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, startAt);
    master.gain.linearRampToValueAtTime(0.22, startAt + 0.018);
    master.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.72);
    master.connect(ctx.destination);

    // Ruido filtrado para imitar el papel del confeti al salir.
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.72), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const envelope = Math.pow(1 - i / data.length, 1.7);
      data[i] = (Math.random() * 2 - 1) * envelope;
    }

    const noise = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(3600, startAt);
    filter.Q.value = 0.75;
    noise.buffer = buffer;
    noise.connect(filter);
    filter.connect(master);
    noise.start(startAt);
    noise.stop(startAt + 0.7);

    // Varios pops rápidos para que suene como un cañón de confeti.
    for (let i = 0; i < 12; i++) {
      const t = startAt + 0.025 + i * 0.052 + Math.random() * 0.018;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1100 + Math.random() * 1100, t);
      osc.frequency.exponentialRampToValueAtTime(350 + Math.random() * 220, t + 0.065);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.085, t + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + 0.08);
    }
  } catch (error) {
    // El efecto visual no depende del sonido.
  }
}

function launchConfetti(audioStart = null) {
  if (!confettiContainer) return;

  confettiContainer.innerHTML = "";
  const pieces = 150;
  const shapes = ["square", "rectangle", "circle"];

  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement("span");
    piece.className = `confetti-piece ${shapes[Math.floor(Math.random() * shapes.length)]}`;

    // La mayoría cae por los costados y por encima de la carta,
    // para que el texto siga siendo fácil de leer.
    const zone = Math.random();
    let startX;
    let startY;

    if (zone < 0.42) {
      startX = 2 + Math.random() * 25;
      startY = Math.random() * 35;
    } else if (zone < 0.84) {
      startX = 73 + Math.random() * 25;
      startY = Math.random() * 35;
    } else {
      startX = 12 + Math.random() * 76;
      startY = Math.random() * 14;
    }

    piece.style.left = `${startX}vw`;
    piece.style.top = `${startY}vh`;
    piece.style.setProperty("--fall-x", `${(Math.random() - 0.5) * 22}vw`);
    piece.style.setProperty("--fall-y", `${45 + Math.random() * 65}vh`);
    piece.style.setProperty("--rotate", `${Math.random() * 1080 - 540}deg`);
    piece.style.setProperty("--duration", `${3 + Math.random() * 3}s`);
    piece.style.setProperty("--delay", `${Math.random() * 0.65}s`);
    piece.style.setProperty("--size", `${7 + Math.random() * 8}px`);
    confettiContainer.appendChild(piece);
  }

  // Una segunda lluvia más pequeña hace que el efecto se sienta festivo
  // durante unos segundos sin dejar confeti permanentemente en pantalla.
  setTimeout(() => {
    if (!letterPaper.classList.contains("show")) return;
    for (let i = 0; i < 45; i++) {
      const piece = document.createElement("span");
      piece.className = `confetti-piece ${shapes[Math.floor(Math.random() * shapes.length)]}`;
      piece.style.left = `${5 + Math.random() * 90}vw`;
      piece.style.top = `${-5 - Math.random() * 8}vh`;
      piece.style.setProperty("--fall-x", `${(Math.random() - 0.5) * 28}vw`);
      piece.style.setProperty("--fall-y", `${105 + Math.random() * 25}vh`);
      piece.style.setProperty("--rotate", `${Math.random() * 1080 - 540}deg`);
      piece.style.setProperty("--duration", `${3.5 + Math.random() * 2.5}s`);
      piece.style.setProperty("--delay", `${Math.random() * 0.4}s`);
      piece.style.setProperty("--size", `${6 + Math.random() * 7}px`);
      confettiContainer.appendChild(piece);
    }
  }, 900);

  setTimeout(() => {
    confettiContainer.innerHTML = "";
  }, 8500);
}


passwordInput.addEventListener("input", () => {
  if (feedback.innerHTML) clearFeedback();
});
