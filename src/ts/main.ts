import "../styles/reset.css";
import "../styles/style.css";

import { Ship, Name, Orientation } from "./modules/ship";
import { Player, Role } from "./modules/player";
import { PlayerRenderer } from "./modules/playerRenderer";

// Functions

// Restart button testing purposes
let count = 0;
function fakeHasLost() {
  count++;
  if (count % 1 === 0) {
    return true;
  } else {
    return false;
  }
}

function updateGameMessage(message: string): void {
  const messageFooter = document.querySelector(".message-footer") as HTMLElement;

  messageFooter.textContent = message || "Invalid key";
}

function addRestartButton() {
  const messageFooter = document.querySelector(".message-footer") as HTMLElement;

  var restartButton = new Image();
  restartButton.src = "images/btn_restart.png";
  restartButton.className = "restart button";
  messageFooter.appendChild(restartButton);

  restartButton.addEventListener("click", function () {
    console.log("Restart clicked");

    // Initialise footer

    playerFooter.style.display = "flex";
    if (window.innerWidth > 600) {
      opponentFooter.style.display = "flex";
    }
    messageFooter.style.display = "none";

    // Initialise data

    player.populateRandomly();
    opponent.populateRandomly();
    player.restartBoard();
    opponent.restartBoard();

    // Render data

    playerRenderer.renderShips();
    playerRenderer.renderAttacks();
    opponentRenderer.clearShips();
    opponentRenderer.renderAttacks();
  });
}

const playRound = async (event: MouseEvent) => {
  // Player's turn

  // Get player's attack coordinates
  const clickedElement = (event.target as HTMLElement).closest(".Opponent-cell") as HTMLElement;
  const [x, y] = JSON.parse(clickedElement.id);

  // Add attack to opponent's object
  try {
    opponent.createAttack([x, y]);
  } catch (error) {
    // Duplicate attack, stop the function
    console.log((error as Error).message);
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
    console.log(`You have taken down the ${hitShip.name}!`);
    updateGameMessage(`You have taken down the ${hitShip.name}!`);
  }

  // Check if opponent has lost
  if (opponent.hasLost()) {
    console.log("Computer has lost!");
    opponentRenderer.boardContainer.removeEventListener("click", playRound);
    updateGameMessage("You win! 🙋🎉");
    addRestartButton();
    return;
  }

  // Opponent's turn

  updateGameMessage("The computer's thinking... 💻");

  try {
    await player.createDelayedRandomUnrepAttack();
  } catch (error) {
    console.log((error as Error).message);
    return;
  } finally {
    playerRenderer.renderAttacks();

    // Check if player has lost
    if (fakeHasLost()) {
      console.log("Player has lost!");
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

// DOM

// Divs

const startScreen = document.getElementById("startScreen") as HTMLElement;
const gameScreen = document.getElementById("gameScreen") as HTMLElement;
const playerName = document.querySelector(".player-name") as HTMLElement;
const playerFooter = document.querySelector(".player-footer") as HTMLElement;
const opponentFooter = document.querySelector(".opponent-footer") as HTMLElement;
const messageFooter = document.querySelector(".message-footer") as HTMLElement;
const opponentContainer = document.querySelector(".Opponent") as HTMLElement;

// Inputs & Buttons

const nicknameInput = document.getElementById("nickname") as HTMLInputElement;
const playButton = document.querySelector(".play") as HTMLElement;
const startButton = document.querySelector(".start") as HTMLElement;
const randomiseButton = document.querySelector(".randomise") as HTMLElement;

// Start screen

startScreen.style.display = "flex";
gameScreen.style.display = "none";
messageFooter.style.display = "none";

/* startScreen.style.display = "none";
gameScreen.style.display = "grid";
playerName.textContent = "John"; */

playButton.addEventListener("click", () => {
  const nickname = nicknameInput.value;
  startScreen.style.display = "none";
  gameScreen.style.display = "grid";
  player.nickname = nickname;
  playerName.textContent = nickname;
  opponent.nickname = "Computer";
});

nicknameInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    const nickname = this.value;
    startScreen.style.display = "none";
    gameScreen.style.display = "grid";
    player.nickname = nickname;
    playerName.textContent = nickname;
    opponent.nickname = "Computer";
  }
});

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
opponentRenderer.createBoard();
playerRenderer.renderShips();

// Start and randomise buttons

randomiseButton.addEventListener("click", () => {
  player.populateRandomly();
  playerRenderer.renderShips();
});

startButton.addEventListener("click", () => {
  player.syncShipsToBoard();
  opponent.syncShipsToBoard();

  playerFooter.style.display = "none";
  opponentFooter.style.display = "none";
  messageFooter.style.display = "flex";

  updateGameMessage("It's your turn 🙋");

  opponentRenderer.boardContainer.classList.add("crosshair-cursor");
  playerRenderer.removeInteractToAll();

  opponentRenderer.boardContainer.addEventListener("click", playRound);
});
