const player = document.getElementById("player");
const obstacles = document.querySelectorAll(".obstacle");
const scoreDisplay = document.getElementById("score");
const gameOverDiv = document.getElementById("game-over");
const restartBtn = document.getElementById("restart-btn");

const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");

let score = 0;
let isGameOver = false;
let jumpCount = 0;
let playerBottom = 0;
let velocity = 0;

const gravityUp = 0.8;
const gravityDown = 0.3;
const jumpStrength = 15;

let obstacleSpeed = parseInt(speedSlider.value);
const minDistance = 150;
const maxDistance = 400;

speedSlider.addEventListener("input", () => {
  obstacleSpeed = parseInt(speedSlider.value);
  speedValue.textContent = obstacleSpeed;
});

function jump() {
  if (!isGameOver && jumpCount < 2) {
    velocity = jumpStrength;
    jumpCount++;
  }
}

document.addEventListener("keydown", jump);
document.addEventListener("touchstart", jump);

function updatePlayer() {
  if (playerBottom > 0 || velocity > 0) {
    let currentGravity = velocity > 0 ? gravityUp : gravityDown;
    velocity -= currentGravity;
    playerBottom += velocity;
    if (playerBottom <= 0) {
      playerBottom = 0;
      velocity = 0;
      jumpCount = 0;
    }
    player.style.bottom = playerBottom + "px";
  }
  requestAnimationFrame(updatePlayer);
}
updatePlayer();

function resetObstaclePosition(i) {
  const distance = minDistance + Math.random() * (maxDistance - minDistance);
  obstacles[i].style.right = -(distance * (i + 1)) + "px";
}

function moveObstacles() {
  if (isGameOver) return;
  obstacles.forEach((obstacle, i) => {
    let currentRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue("right"));
    obstacle.style.right = (currentRight + obstacleSpeed) + "px";
    if (currentRight > window.innerWidth) {
      resetObstaclePosition(i);
      score++;
      scoreDisplay.textContent = "Score: " + score;
    }
    const obstacleRect = obstacle.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    if (
      playerRect.right > obstacleRect.left &&
      playerRect.left < obstacleRect.right &&
      playerRect.bottom > obstacleRect.top &&
      playerRect.top < obstacleRect.bottom
    ) {
      isGameOver = true;
      gameOverDiv.style.display = "block";
    }
  });
  requestAnimationFrame(moveObstacles);
}
moveObstacles();

restartBtn.addEventListener("click", () => {
  isGameOver = false;
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  gameOverDiv.style.display = "none";
  playerBottom = 0;
  velocity = 0;
  jumpCount = 0;
  player.style.bottom = "0px";
  obstacleSpeed = parseInt(speedSlider.value);
  obstacles.forEach((obstacle, i) => {
    resetObstaclePosition(i);
  });
  moveObstacles();
});
