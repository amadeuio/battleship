import "../styles/reset.css";
import "../styles/style.css";

import restartButtonImage from "/images/btn_restart.png";

import { Player, Role } from "./modules/player";
import { PlayerRenderer } from "./modules/playerRenderer";

// Functions

function handlePlayButton(): void {
  startScreen.style.display = "none";
  gameScreen.style.display = "grid";

  const nickname: string = nicknameInput.value || "Anonymous";
  player.nickname = nickname;
  playerName.textContent = nickname;
  opponent.nickname = "Computer";

  document.addEventListener("keyup", function (event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleStartButton();
    }
  });
}

function handleStartButton(): void {
  player.syncShipsToBoard();
  opponent.syncShipsToBoard();

  playerFooter.style.display = "none";
  opponentFooter.style.display = "none";
  messageFooter.style.display = "flex";

  updateGameMessage("It's your turn 🙋");

  playerRenderer.removeInteractToAll();
  opponentRenderer.boardContainer.classList.add("crosshair-cursor");
  opponentRenderer.boardContainer.addEventListener("click", playRound);
}

function handleRestartButton(): void {
  playerFooter.style.display = "flex";
  if (window.innerWidth > 600) {
    opponentFooter.style.display = "flex";
  }
  messageFooter.style.display = "none";

  player.populateRandomly();
  opponent.populateRandomly();
  player.restartBoard();
  opponent.restartBoard();

  playerRenderer.renderShips();
  playerRenderer.renderAttacks();
  opponentRenderer.clearShips();
  opponentRenderer.renderAttacks();
}

function addRestartButton(): void {
  const messageFooter: HTMLDivElement = document.querySelector(".message-footer") as HTMLDivElement;

  const restartButton: HTMLImageElement = new Image();
  restartButton.src = restartButtonImage;
  restartButton.className = "restart-button";
  messageFooter.appendChild(restartButton);

  restartButton.addEventListener("click", handleRestartButton);
}

function updateGameMessage(message: string): void {
  const messageFooter: HTMLDivElement = document.querySelector(".message-footer") as HTMLDivElement;
  messageFooter.textContent = message || "Invalid key";
}

const playRound = async (event: MouseEvent): Promise<void> => {
  // Player's turn

  // Get player's attack coordinates
  const clickedElement = event.target as HTMLDivElement;
  const [x, y]: [number, number] = JSON.parse(clickedElement.id);

  // Add attack to opponent's object
  try {
    opponent.createAttack([x, y]);
    opponentRenderer.renderAttackAnimation([x, y]);
  } catch (error) {
    // Duplicate attack, stop the function
    updateGameMessage((error as Error).message);
    return;
  }

  // Render updated attacks object
  opponentRenderer.renderAttacks();

  // Remove crosshair cursor and disable the click event listener on opponent's board
  opponentContainer?.classList.remove("crosshair-cursor");
  opponentRenderer.boardContainer.removeEventListener("click", playRound);

  // Check if a ship has been sunk, and render it if so
  const hitShip = opponent.findShipByCoord([x, y]);
  if (hitShip && hitShip.sunk) {
    opponentRenderer.renderShip(hitShip);
    updateGameMessage(`You have taken down the ${hitShip.name}!`);
  }

  // Check if opponent has lost
  if (opponent.hasLost()) {
    opponentRenderer.boardContainer.removeEventListener("click", playRound);
    updateGameMessage("You win! 🙋🎉");
    addRestartButton();
    return;
  }

  // Opponent's turn

  updateGameMessage("The computer's thinking... 💻");

  try {
    const opponentAttackCoords: [number, number] = await player.createDelayedRandomUnrepAttack();
    playerRenderer.renderAttackAnimation(opponentAttackCoords);
  } catch (error) {
    console.log((error as Error).message);
    return;
  } finally {
    playerRenderer.renderAttacks();

    // Check if player has lost
    if (player.hasLost()) {
      opponentRenderer.boardContainer.removeEventListener("click", playRound);
      updateGameMessage("Computer wins! 💻🎉");
      addRestartButton();
      return;
    }

    // Re-enable click event listener and crosshair cursor, signaling it's the player's turn again
    updateGameMessage("It's your turn 🙋");
    opponentContainer?.classList.add("crosshair-cursor");
    opponentRenderer.boardContainer.addEventListener("click", playRound);
  }
};

// Program starts

// Data

// Create player & playerRenderer

const player: Player = new Player(Role.Player);
const opponent: Player = new Player(Role.Opponent);
const playerRenderer: PlayerRenderer = new PlayerRenderer(player);
const opponentRenderer: PlayerRenderer = new PlayerRenderer(opponent);

// Initialize player data

player.populateRandomly();
opponent.populateRandomly();

// Render data

playerRenderer.createBoard();
playerRenderer.renderShips();
opponentRenderer.createBoard();

// DOM

// Divs

const startScreen: HTMLDivElement = document.getElementById("startScreen") as HTMLDivElement;
const gameScreen: HTMLDivElement = document.getElementById("gameScreen") as HTMLDivElement;
const playerName: HTMLDivElement = document.querySelector(".player-name") as HTMLDivElement;
const playerFooter: HTMLDivElement = document.querySelector(".player-footer") as HTMLDivElement;
const opponentFooter: HTMLDivElement = document.querySelector(".opponent-footer") as HTMLDivElement;
const messageFooter: HTMLDivElement = document.querySelector(".message-footer") as HTMLDivElement;
const opponentContainer: HTMLDivElement = document.querySelector(".Opponent") as HTMLDivElement;

// Inputs & Buttons

const nicknameInput: HTMLInputElement = document.getElementById("nickname") as HTMLInputElement;
const playButton: HTMLButtonElement = document.querySelector(".play-button") as HTMLButtonElement;
const startButton: HTMLButtonElement = document.querySelector(".start-button") as HTMLButtonElement;
const randomiseButton: HTMLButtonElement = document.querySelector(
  ".randomise-button"
) as HTMLButtonElement;

// Start screen

startScreen.style.display = "flex";
gameScreen.style.display = "none";
messageFooter.style.display = "none";

playButton.addEventListener("click", handlePlayButton);

nicknameInput.addEventListener("keyup", function (event: KeyboardEvent) {
  if (event.key === "Enter") {
    handlePlayButton();
  }
});

document.addEventListener("keyup", function (event: KeyboardEvent) {
  if (event.key === "Enter") {
    handlePlayButton();
  }
});

// Game screen

randomiseButton.addEventListener("click", () => {
  player.populateRandomly();
  playerRenderer.renderShips();
});

startButton.addEventListener("click", handleStartButton);
