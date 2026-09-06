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

  if (!entered) {
    showFeedback(
      "Primero tienes que intentar descubrirla... 👀",
      "Vamos mi amor, tú puedes. ❤️"
    );
    shakeCard();
    return;
  }

  if (entered === CORRECT_PASSWORD) {
    unlock();
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

togglePassword.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePassword.textContent = isPassword ? "◉" : "♡";
});

enterButton.addEventListener("click", checkPassword);

const letterScene = document.getElementById("letterScene");
const envelopeStage = document.getElementById("envelopeStage");
const envelope = document.getElementById("envelope");
const openLetterButton = document.getElementById("openLetterButton");
const letterPaper = document.getElementById("letterPaper");

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
  setTimeout(() => { envelopeStage.style.display = "none"; letterPaper.classList.add("show"); }, 1050);
});

passwordInput.addEventListener("input", () => {
  if (feedback.innerHTML) clearFeedback();
});
