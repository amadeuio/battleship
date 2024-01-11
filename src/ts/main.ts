import "../styles/reset.css";
import "../styles/style.css";

import { Name, Orientation, Ship } from "./modules/ship";
import { Player, Cell, Role } from "./modules/player";
import { PlayerRenderer } from "./modules/playerRenderer";
import { getRandomCoordinate } from "./utils/getRandomCoordinate";

// Screen switching

function playGame(): void {
  startScreen.style.display = "none";
  gameScreen.style.display = "flex";
}

// Divs
const startScreen = document.getElementById("startScreen") as HTMLElement;
const gameScreen = document.getElementById("gameScreen") as HTMLElement;
const playerFooter = document.querySelector(".player-footer") as HTMLElement;

// Inputs & Buttons
const nicknameInput = document.getElementById("nickname") as HTMLInputElement;
const playButton = document.querySelector(".play-button") as HTMLElement;
const startButton = document.querySelector(".start-button") as HTMLElement;

startScreen.style.display = "none";
gameScreen.style.display = "flex";
playerFooter.style.visibility = "hidden";

startButton.addEventListener("click", () => {
  playerFooter.style.visibility = "hidden";
});

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

// Program starts

// Create player data

const player: Player = new Player(Role.Player);
const opponent: Player = new Player(Role.Opponent);

const destroyer = new Ship(Name.Destroyer, [5, 5], Orientation.Horizontal);
const carrier = new Ship(Name.Carrier, [3, 3], Orientation.Vertical);
const battleship = new Ship(Name.Battleship, [0, 0], Orientation.Vertical);
const cruiser = new Ship(Name.Cruiser, [1, 0], Orientation.Vertical);
const submarine = new Ship(Name.Submarine, [4, 6], Orientation.Horizontal);

player.placeShip(battleship);
player.placeShip(destroyer);
player.placeShip(carrier);
player.placeShip(cruiser);
player.placeShip(submarine);

opponent.placeShip(battleship);
opponent.placeShip(destroyer);
opponent.placeShip(carrier);
opponent.placeShip(cruiser);
opponent.placeShip(submarine);

player.placeShipsOnBoard();
opponent.placeShipsOnBoard();

player.createAttack([0, 0]);

opponent.createAttack([0, 0]);
opponent.createAttack([0, 1]);

// Create PlayerRenderer

const playerRenderer: PlayerRenderer = new PlayerRenderer(player);
const opponentRenderer: PlayerRenderer = new PlayerRenderer(opponent);

// Render

playerRenderer.createBoard();
playerRenderer.renderShips();
playerRenderer.renderAttacks();
opponentRenderer.createBoard();
opponentRenderer.renderAttacks();

async function delayedRandomAttack(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      player.createAttack(getRandomCoordinate());
      playerRenderer.renderAttacks();
      resolve();
    }, 900);
  });
}

const playRound = async (event: MouseEvent) => {
  // Player's turn
  const clickedElement = (event.target as HTMLElement).closest(".Opponent-cell") as HTMLElement;
  clickedElement.classList.add("default-cursor");

  // Coordinates of clicked array
  const [x, y] = JSON.parse(clickedElement.id);

  try {
    opponent.createAttack([x, y]);
  } catch (error) {
    // Duplicate attack, stop the function
    console.log((error as Error).message);
    return;
  }

  opponentRenderer.renderAttacks();

  // Computer's turn

  // Disable the click event listener
  opponentRenderer.boardContainer.removeEventListener("click", playRound);

  try {
    // Start the async operation
    await delayedRandomAttack();
    // Async operation completed successfully
  } catch (error) {
    // Handle errors from the async operation
  } finally {
    // Re-enable the click event listener whether the async operation succeeds or fails
    opponentRenderer.boardContainer.addEventListener("click", playRound);
  }
};

opponentRenderer.boardContainer.addEventListener("click", playRound);
