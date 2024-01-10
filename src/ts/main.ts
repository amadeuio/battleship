import "../styles/reset.css";
import "../styles/style.css";

import { Name, Orientation, Ship } from "./modules/ship";
import { Player, Cell, Role } from "./modules/player";
import { PlayerRenderer } from "./modules/playerRenderer";

// Screen switching

const startScreen = document.getElementById("startScreen") as HTMLElement;
const gameScreen = document.getElementById("gameScreen") as HTMLElement;
const nicknameInput = document.getElementById("nickname") as HTMLInputElement;
const startButton = document.querySelector(".start-button") as HTMLElement;

startScreen.style.display = "none";
gameScreen.style.display = "flex";

startButton.addEventListener("click", () => {
  const nickname = nicknameInput.value;
  startGame();
});

nicknameInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    const nickname = this.value;
    startGame();
  }
});

function startGame(): void {
  startScreen.style.display = "none";
  gameScreen.style.display = "flex";
}

// Program starts

// Create player data

const player: Player = new Player(Role.Player);
const opponent: Player = new Player(Role.Opponent);

const destroyer = new Ship(Name.Destroyer, [5, 5], Orientation.Horizontal);
const carrier = new Ship(Name.Carrier, [3, 3], Orientation.Vertical);
const battleship = new Ship(Name.Battleship, [0, 2], Orientation.Vertical);
const cruiser = new Ship(Name.Cruiser, [1, 0], Orientation.Vertical);
const submarine = new Ship(Name.Submarine, [4, 6], Orientation.Horizontal);

player.placeShip(destroyer);
player.placeShip(carrier);
player.placeShip(battleship);
player.placeShip(cruiser);
player.placeShip(submarine);

// Create PlayerRenderer

const playerRenderer: PlayerRenderer = new PlayerRenderer(player);
const opponentRenderer: PlayerRenderer = new PlayerRenderer(opponent);

// Render

playerRenderer.createBoard();
playerRenderer.renderShips();
playerRenderer.addDragDrop();

opponentRenderer.createBoard();
