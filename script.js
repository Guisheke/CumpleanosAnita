const CORRECT_PASSWORD = "anilu100903";

const passwordForm = document.getElementById("passwordForm");
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
  event.preventDefault();

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
    Pistas y comentarios separados.
    Las condiciones buscan reconocer algunos intentos probables
    sin revelar directamente la contraseña.
  */

  if (entered === "anilu") {
    revealHint(2);
    showFeedback(
      "Encontraste una parte... pero una contraseña tan importante no podía ser tan cortita, ¿no? 👀",
      "Encontraste una parte, mi amor, sigue intentando. ❤️"
    );
  } else if (entered === "100903") {
    revealHint(3);
    showFeedback(
      "También encontraste una parte... pero todavía falta saber de quién estamos hablando. ❤️",
      "Muy bien mi amor, ya tienes una parte, ahora encuentra la otra. 🥰"
    );
  } else if (
    entered === "anita100903" ||
    entered === "princesaanita" ||
    entered === "anita"
  ) {
    revealHint(2);
    showFeedback(
      "Estás cerca. Hay un nombre que alguien de tu familia te decía de una manera muy especial... 👀",
      "Estás cerca mi amor pero hay un nombre más especial. ❤️"
    );
  } else if (
    entered === "ana100903" ||
    entered === "ana"
  ) {
    revealHint(1);
    showFeedback(
      "Estás cerca... pero hay alguien de tu familia que te llamó de una manera muy especial. ¿Recuerdas?",
      "Sigue buscando mi amor, estoy segura de que lo recuerdas. 🥰"
    );
  } else {
    if (attempts >= 2) revealHint(1);
    if (attempts >= 4) revealHint(2);
    if (attempts >= 6) revealHint(3);
    if (attempts >= 8) revealHint(4);

    showFeedback(
      "Recuerda que todas las respuestas están relacionadas contigo. ❤️",
      "Sigue las pistas mi niña, estás a punto de lograrlo. ❤️"
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
    successOverlay.classList.add("active");
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

passwordForm.addEventListener("submit", checkPassword);

continueButton.addEventListener("click", () => {
  /*
    Esta primera versión termina aquí.
    En la siguiente etapa podemos cambiar este botón para llevar
    a la carta de cumpleaños.
  */
  successOverlay.classList.remove("active");

  document.querySelector(".success-content p:last-of-type").textContent =
    "La siguiente parte de tu regalo estará aquí muy pronto. 💕";
});

passwordInput.addEventListener("input", () => {
  if (feedback.innerHTML) clearFeedback();
});
