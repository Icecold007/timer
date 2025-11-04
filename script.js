let startTime = 3600;
let currentTime = startTime;
let timerInterval = null;
let isRunning = false;

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const timerForm = document.getElementById("timerSetup");
const timeUpMessage = document.getElementById("timeUpMessage");
const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");
const timeSetup = document.querySelector(".time-setup");
const toggleSetup = document.getElementById("toggleSetup");
const alarmSound = document.getElementById("alarmSound");

let setupCollapsed = true;

function setCollapsed(collapsed) {
  setupCollapsed = !!collapsed;
  if (setupCollapsed) {
    timeSetup.classList.add("collapsed");
    toggleSetup.setAttribute("aria-expanded", "false");
    toggleSetup.setAttribute("aria-label", "Expand timer setup");

    hoursInput.disabled = true;
    minutesInput.disabled = true;
    secondsInput.disabled = true;
  } else {
    timeSetup.classList.remove("collapsed");
    toggleSetup.setAttribute("aria-expanded", "true");
    toggleSetup.setAttribute("aria-label", "Collapse timer setup");
    hoursInput.disabled = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
  }
}

toggleSetup.addEventListener("click", () => {
  setCollapsed(!setupCollapsed);
});

timerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const hours = parseInt(hoursInput.value) || 0;
  const minutes = parseInt(minutesInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;

  startTime = hours * 3600 + minutes * 60 + seconds;
  if (startTime > 0) {
    currentTime = startTime;
    stopTimer();
    flipAllCards(currentTime);
  }
});

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    timerInterval = setInterval(() => {
      if (currentTime > 0) {
        currentTime--;
        flipAllCards(currentTime);
        if (currentTime === 0) {
          setTimeout(() => {
            stopTimer();
            showTimeUpMessage();
            playAlarmSound();
          }, 1000);
        }
      }
    }, 1000);
  }
}

function stopTimer() {
  if (isRunning) {
    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    clearInterval(timerInterval);
  }
}

function resetTimer() {
  stopTimer();
  currentTime = startTime;
  flipAllCards(currentTime);
}

function playAlarmSound() {
  alarmSound.currentTime = 0;
  alarmSound.play().catch((error) => {
    console.log("Audio playback failed:", error);
  });
}

function stopAlarmSound() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
}

startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);

flipAllCards(currentTime);

function flipAllCards(time) {
  const seconds = time % 60;
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);

  flip(document.querySelector("[data-hours-tens]"), Math.floor(hours / 10));
  flip(document.querySelector("[data-hours-ones]"), hours % 10);
  flip(document.querySelector("[data-minutes-tens]"), Math.floor(minutes / 10));
  flip(document.querySelector("[data-minutes-ones]"), minutes % 10);
  flip(document.querySelector("[data-seconds-tens]"), Math.floor(seconds / 10));
  flip(document.querySelector("[data-seconds-ones]"), seconds % 10);
}

function flip(flipCard, newNumber) {
  const topHalf = flipCard.querySelector(".top");
  const startNumber = parseInt(topHalf.textContent);
  if (newNumber === startNumber) return;

  const bottomHalf = flipCard.querySelector(".bottom");
  const topFlip = document.createElement("div");
  topFlip.classList.add("top-flip");
  const bottomFlip = document.createElement("div");
  bottomFlip.classList.add("bottom-flip");

  topHalf.textContent = startNumber;
  bottomHalf.textContent = startNumber;
  topFlip.textContent = startNumber;
  bottomFlip.textContent = newNumber;

  topFlip.addEventListener("animationstart", (e) => {
    topHalf.textContent = newNumber;
  });
  topFlip.addEventListener("animationend", (e) => {
    topFlip.remove();
  });
  bottomFlip.addEventListener("animationend", (e) => {
    bottomHalf.textContent = newNumber;
    bottomFlip.remove();
  });
  flipCard.append(topFlip, bottomFlip);
}

function showTimeUpMessage() {
  timeUpMessage.classList.add("visible");
}

function dismissTimeUpMessage() {
  timeUpMessage.classList.remove("visible");
  stopAlarmSound();
}
