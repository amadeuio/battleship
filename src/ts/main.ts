import "../styles/reset.css";
import "../styles/style.css";

import { Name, Orientation, Ship } from "./modules/ship";
import { Gameboard, Cell } from "./modules/gameboard";

class Player {
  name: string;
  gameboard: Gameboard;
  death: boolean;

  constructor(name: string, gameboard: Gameboard) {
    this.name = name;
    this.gameboard = gameboard;
    this.death = false;
  }
}

class PlayerRenderer {
  player: Player;
  boardContainer: HTMLElement;

  constructor(player: Player) {
    this.player = player;
    this.boardContainer = document.createElement("div");
    this.boardContainer.className = this.player.name;
  }

  createBoard() {
    const boardContainer = document.createElement("div");
    boardContainer.className = this.player.name;

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        // Create div
        const boardCell = document.createElement("div");
        boardCell.className = this.player.name + "-cell";

        // Set the id of the div to be its coordinates
        const coordinates: [number, number] = [col, row];
        boardCell.id = JSON.stringify(coordinates);

        this.boardContainer.appendChild(boardCell);
      }
    }

    document.body.appendChild(this.boardContainer);
  }

  renderAttacks() {
    const board = this.player.gameboard.board;

    // Flatten the board matrix column-wise
    const transposedBoard = board[0].map((_, i) => board.map((row) => row[i]));
    const boardList = transposedBoard.flat();

    // Select html grid items inside specified gameboard
    var htmlCells = this.boardContainer.getElementsByClassName(this.player.name + "-cell");

    // Iterate through board list, add 🔥 to the corresponding html divs
    boardList.forEach((objCell, index) => {
      if (objCell.hit && objCell.ship) {
        htmlCells[index].textContent = "🔥";
      }
    });
  }

  renderShips() {
    function renderShip(ship: Ship, gameboard: HTMLElement) {
      const [x, y] = ship.position;

      // Remove existing ship with the same name
      const existingShip = document.querySelector(`.${ship.name}`);
      if (existingShip) {
        existingShip.remove();
      }

      // Create ship div
      const shipDiv = document.createElement("div");
      shipDiv.classList.add(ship.name);
      shipDiv.setAttribute("draggable", "true");
      gameboard.appendChild(shipDiv);

      // Find pixel coordinates of ship
      const cellSize = 50; // px
      const topValue = `${y * cellSize}px`;
      const leftValue = `${x * cellSize}px`;

      // Add dimensions to ship
      if (ship.orientation === "Horizontal") {
        shipDiv.style.width = `${ship.length * cellSize}px`;
        shipDiv.style.height = `${cellSize}px`;
      } else {
        shipDiv.style.width = `${cellSize}px`;
        shipDiv.style.height = `${ship.length * cellSize}px`;
      }

      // Position ship
      shipDiv.style.top = topValue;
      shipDiv.style.left = leftValue;
    }

    this.player.gameboard.ships.forEach((ship) => renderShip(ship, this.boardContainer));
  }

  addDragDrop(): void {
    this.boardContainer.addEventListener("dragstart", (event: DragEvent) => {
      // Get the dragged ship
      const draggedShip = (event.target as HTMLElement).className;
      if (event.dataTransfer) {
        event.dataTransfer.setData("text/plain", draggedShip);
      }
    });

    document.addEventListener("dragover", (event: DragEvent) => {
      event.preventDefault();
    });

    // Find the ship and coordinates in which it has been droped
    // Update the gameboard
    // Render the updated ship
    document.addEventListener("drop", (event: DragEvent) => {
      event.preventDefault();

      // Get the ship that has been dropped
      if (event.dataTransfer) {
        const droppedClass = event.dataTransfer.getData("text/plain");
        const droppedShip = this.player.gameboard.ships.find((ship) => ship.name === droppedClass);

        if (droppedShip) {
          // Find the position in which the ship has been dropped
          const dropCell = (event.target as HTMLElement).closest(`.${this.player.name}-cell`);

          if (dropCell) {
            // Update the gameboard with the new position
            const [x, y] = JSON.parse(dropCell.id);
            this.player.gameboard.moveShip(droppedShip, [x, y]);

            // Render updated ship
            this.renderShips();
          }
        }
      }
    });
  }
}

// Program starts

// Create gameboard data

const playerGameboardObj: Gameboard = new Gameboard();

const destroyer = new Ship(Name.Destroyer, [5, 5], Orientation.Horizontal);
const carrier = new Ship(Name.Carrier, [3, 3], Orientation.Vertical);
const battleship = new Ship(Name.Battleship, [0, 2], Orientation.Vertical);
const cruiser = new Ship(Name.Cruiser, [7, 9], Orientation.Horizontal);

playerGameboardObj.placeShip(destroyer);
playerGameboardObj.placeShip(carrier);
playerGameboardObj.placeShip(battleship);
playerGameboardObj.placeShip(cruiser);

playerGameboardObj.createAttack([5, 5]);
playerGameboardObj.createAttack([3, 3]);
playerGameboardObj.createAttack([0, 2]);
playerGameboardObj.createAttack([7, 9]);

// Create player data

const player1: Player = new Player("Player1", playerGameboardObj);

// Create PlayerRenderer

const playerRenderer1: PlayerRenderer = new PlayerRenderer(player1);

// Render

playerRenderer1.createBoard();
playerRenderer1.renderAttacks();
playerRenderer1.renderShips();
playerRenderer1.addDragDrop();
