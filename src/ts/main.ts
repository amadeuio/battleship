import "../styles/reset.css";
import "../styles/style.css";

import { Name, Orientation, Ship } from "./modules/ship";
import { Player, Cell, Role } from "./modules/player";
import { PlayerRenderer } from "./modules/playerRenderer";

// Functions

function playGame(): void {
  startScreen.style.display = "none";
  gameScreen.style.display = "flex";
}

function updateGameMessage(message: string): void {
  const messageFooter = document.querySelector(".message-footer") as HTMLElement;

  messageFooter.textContent = message || "Invalid key";
}

function addRestartButton() {
  const messageFooter = document.querySelector(".message-footer") as HTMLElement;

  var restartButton = document.createElement("button");
  restartButton.className = "restart-button";
  restartButton.innerHTML = "Restart";

  restartButton.addEventListener("click", function () {
    console.log("Restart clicked");
  });

  messageFooter.appendChild(restartButton);
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

  // Check if a ship has been sunk, and render it if so
  const hitShip = opponent.findShip([x, y]);
  if (hitShip && hitShip.sunk) {
    opponentRenderer.renderShip(hitShip);
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

  // Remove crosshair cursor and disable the click event listener on opponent's board
  opponentContainer?.classList.remove("crosshair-cursor");
  opponentRenderer.boardContainer.removeEventListener("click", playRound);

  updateGameMessage("The computer's thinking... 💻");

  try {
    await player.createDelayedRandomUnrepAttack();
  } catch (error) {
    console.log((error as Error).message);
    return;
  } finally {
    playerRenderer.renderAttacks();

    // Check if player has lost
    if (player.hasLost()) {
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

// Divs
const startScreen = document.getElementById("startScreen") as HTMLElement;
const gameScreen = document.getElementById("gameScreen") as HTMLElement;
const footer = document.querySelector(".footer") as HTMLElement;
const playerFooter = document.querySelector(".player-footer") as HTMLElement;
const opponentFooter = document.querySelector(".opponent-footer") as HTMLElement;
const opponentContainer = document.querySelector(".Opponent") as HTMLElement;

// Inputs & Buttons
const nicknameInput = document.getElementById("nickname") as HTMLInputElement;
const playButton = document.querySelector(".play-button") as HTMLElement;
const startButton = document.querySelector(".start-button") as HTMLElement;
const randomiseButton = document.querySelector(".randomise-button") as HTMLElement;

// Initial conditions
startScreen.style.display = "none";
gameScreen.style.display = "grid";

playButton.addEventListener("click", () => {
  const nickname = nicknameInput.value;
  playGame();
});

nicknameInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    const nickname = this.value;
    playGame();
  }
});

// Create player data

const player: Player = new Player(Role.Player);
const opponent: Player = new Player(Role.Opponent);

player.populateRandomly();
opponent.populateRandomly();

// Create Rendering

const playerRenderer: PlayerRenderer = new PlayerRenderer(player);
const opponentRenderer: PlayerRenderer = new PlayerRenderer(opponent);

playerRenderer.createBoard();
playerRenderer.renderShips();
playerRenderer.addDragDrop();
opponentRenderer.createBoard();

// Start and randomise buttons

randomiseButton.addEventListener("click", () => {
  player.populateRandomly();
  playerRenderer.renderShips();
});

startButton.addEventListener("click", () => {
  player.placeShipsOnBoard();
  opponent.placeShipsOnBoard();

  playerFooter.remove();
  opponentFooter.remove();

  const messageFooter = document.createElement("div");
  messageFooter.className = "message-footer";
  footer.appendChild(messageFooter);

  updateGameMessage("It's your turn 🙋");

  opponentRenderer.boardContainer.classList.add("crosshair-cursor");
  playerRenderer.removeDragDrop();

  opponentRenderer.boardContainer.addEventListener("click", playRound);
});
