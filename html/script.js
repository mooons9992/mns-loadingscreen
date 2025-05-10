const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const loadingText = document.getElementById("loadingText");
const tipText = document.getElementById("tipText");
const muteButton = document.getElementById("muteButton");
const bgMusic = document.getElementById("bgMusic");

bgMusic.volume = 0.3;
let isMuted = false;
let currentVolume = 0.3;

const tips = [
  "Tip: Press F1 to open the interaction menu",
  "Tip: TAB opens your inventory",
  "Tip: I opens your player menu",
  "Tip: Press ESC to view your map",
  "Tip: T opens the chat window",
  "Tip: Press M to view your phone",
  "Tip: Press L to lock/unlock your vehicle",
  "Tip: Hold ALT to interact with objects and NPCs",
  "Tip: Press B for your seatbelt",
  "Tip: Hold X to put your hands up",
  "Tip: You can buy vehicles at the car dealership",
  "Tip: Visit the bank to manage your finances",
  "Tip: You can store your items in the trunk of your vehicle",
  "Tip: Visit clothing stores to customize your character",
  "Tip: Your character needs to eat and drink to stay healthy",
  "Tip: Join our Discord server for more information!",
  "Tip: Follow server rules to avoid getting banned",
  "Tip: Make sure to report any bugs you encounter",
  "Tip: Need help? Ask in the Discord or in-game chat"
];

let currentTipIndex = 0;

let progress = 0;
let loadingInterval;
const fakeTotalDuration = 15000;
const startTime = Date.now();

function init() {
  simulateLoading();
  setInterval(changeTip, 5000);
  setupVolumeControl();
  setupBackgroundVideo();

  window.addEventListener("message", (event) => {
    const data = event.data;

    if (data.eventName === "loadProgress") {
      updateRealProgress(data.loadFraction);
    }

    if (data.eventName === "updateText") {
      updateLoadingText(data.text);
    }
  });
}

function copyToClipboard(text) {
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  
  // Show a small notification that the link was copied
  const notification = document.createElement('div');
  notification.textContent = 'Discord link copied to clipboard!';
  notification.style.position = 'fixed';
  notification.style.bottom = '70px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.backgroundColor = 'rgba(0,0,0,0.7)';
  notification.style.color = 'white';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '1000';
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s ease';
    setTimeout(() => document.body.removeChild(notification), 500);
  }, 3000);
}

function simulateLoading() {
  loadingInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    progress = Math.min((elapsed / fakeTotalDuration) * 100, 99.5);

    updateProgress(progress);

    if (progress < 30) {
      updateLoadingText("Connecting to server...");
    } else if (progress < 60) {
      updateLoadingText("Loading game resources...");
    } else if (progress < 90) {
      updateLoadingText("Preparing game world...");
    } else {
      updateLoadingText("Almost ready...");
    }

    if (progress >= 99.5) {
      clearInterval(loadingInterval);
    }
  }, 100);
}

function updateRealProgress(fraction) {
  if (loadingInterval) {
    clearInterval(loadingInterval);
  }

  progress = fraction * 100;
  updateProgress(progress);

  if (fraction >= 1.0) {
    updateLoadingText("Loading complete!");
    progressText.textContent = "100%";
    progressBar.style.width = "100%";
  }
}

function updateProgress(value) {
  progressBar.style.width = `${value}%`;
  progressText.textContent = `${Math.floor(value)}%`;
}

function updateLoadingText(text) {
  loadingText.textContent = text;
}

function changeTip() {
  tipText.style.opacity = 0;
  
  setTimeout(() => {
    currentTipIndex = (currentTipIndex + 1) % tips.length;
    tipText.textContent = tips[currentTipIndex];
    tipText.style.opacity = 1;
  }, 500);
}

function setupVolumeControl() {
  const volumeSlider = document.getElementById("volumeSlider");

  // Initialize slider position
  volumeSlider.value = currentVolume * 100;

  muteButton.addEventListener("click", () => {
    if (isMuted) {
      bgMusic.volume = currentVolume;
      muteButton.textContent = "🎵";
      volumeSlider.value = currentVolume * 100;
      isMuted = false;
    } else {
      currentVolume = bgMusic.volume;
      bgMusic.volume = 0;
      muteButton.textContent = "🔇";
      volumeSlider.value = 0;
      isMuted = true;
    }
  });

  volumeSlider.addEventListener("input", function() {
    const volumeValue = this.value / 100;
    bgMusic.volume = volumeValue;
    currentVolume = volumeValue;

    if (volumeValue === 0) {
      muteButton.textContent = "🔇";
      isMuted = true;
    } else {
      muteButton.textContent = "🎵";
      isMuted = false;
    }
  });
}

function setupBackgroundVideo() {
  const bgVideo = document.getElementById("bgVideo");
  
  // Handle video errors and provide fallback
  bgVideo.addEventListener("error", () => {
    console.error("Video failed to load. Using fallback background.");
    document.querySelector(".background").style.backgroundImage = "url('assets/fallback-background.jpg')";
    document.querySelector(".background").style.backgroundSize = "cover";
  });

  // Ensure video plays properly
  bgVideo.play().catch(error => {
    console.error("Autoplay prevented:", error);
    
    // Create play button for manual play
    const playButton = document.createElement("button");
    playButton.textContent = "Play";
    playButton.className = "play-button";
    playButton.addEventListener("click", () => {
      bgVideo.play();
      playButton.remove();
    });
    
    document.body.appendChild(playButton);
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
