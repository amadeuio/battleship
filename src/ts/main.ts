import "../styles/reset.css";
import "../styles/style.css";

import { Name, Orientation, Ship } from "./modules/ship";
import { Player, Cell, Role } from "./modules/player";
import { PlayerRenderer } from "./modules/playerRenderer";

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

player.placeShipsOnBoard();
opponent.placeShipsOnBoard();

player.createAttack([0, 0]);

opponent.createAttack([0, 0]);
opponent.createAttack([0, 1]);

//console.log(player.ships[0]);

// Create PlayerRenderer

const playerRenderer: PlayerRenderer = new PlayerRenderer(player);
const opponentRenderer: PlayerRenderer = new PlayerRenderer(opponent);

// Render

playerRenderer.createBoard();
playerRenderer.renderShips();
//playerRenderer.addDragDrop();

playerRenderer.renderAttacks();

opponentRenderer.createBoard();
opponentRenderer.renderAttacks();
//opponentRenderer.renderShips();

playerRenderer.boardContainer.addEventListener("click", (event) => {
  if (event.target) {
    const clickedElement = (event.target as HTMLElement).closest(".Player-cell");

    if (clickedElement) {
      const [x, y] = JSON.parse(clickedElement.id);
      player.createAttack([x, y]);
      playerRenderer.renderAttacks();
    }
  }
});

opponentRenderer.boardContainer.addEventListener("click", (event) => {
  if (event.target) {
    const clickedElement = (event.target as HTMLElement).closest(".Opponent-cell");

    if (clickedElement) {
      const [x, y] = JSON.parse(clickedElement.id);
      opponent.createAttack([x, y]);
      opponentRenderer.renderAttacks();

      console.log(opponent.ships[0]);
    }
  }
});
