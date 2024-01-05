import "../styles/reset.css";
import "../styles/style.css";

import { Name, Orientation, Ship } from "./modules/ship";
import { Gameboard, Cell } from "./modules/gameboard";

// Create a 10x10 gameboard
function createBoard(gameboard: HTMLElement) {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      // Create div
      const gridItem = document.createElement("div");
      gridItem.className = "grid-item";

      // Set the id of the div to be its coordinates
      const coordinates: [number, number] = [col, row];
      gridItem.id = JSON.stringify(coordinates);

      gameboard.appendChild(gridItem);
    }
  }
}

// Render a ship object on a gameboard
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

const ships: any = [
  {
    name: "Destroyer",
    length: 3,
    position: [2, 2],
    orientation: "Horizontal",
    hits: 0,
    sunk: false,
  },
  {
    name: "Battleship",
    length: 4,
    position: [5, 4],
    orientation: "Vertical",
    hits: 0,
    sunk: false,
  },
  {
    name: "Submarine",
    length: 3,
    position: [5, 9],
    orientation: "Horizontal",
    hits: 0,
    sunk: false,
  },
  {
    name: "Carrier",
    length: 5,
    position: [1, 1],
    orientation: "Vertical",
    hits: 0,
    sunk: false,
  },
  {
    name: "Cruiser",
    length: 3,
    position: [9, 6],
    orientation: "Vertical",
    hits: 0,
    sunk: false,
  },
];

// Program starts

// Create data
const myGameboard = new Gameboard();
myGameboard.placeShip(new Ship(Name.Destroyer, [5, 5], Orientation.Horizontal));
myGameboard.placeShip(new Ship(Name.Carrier, [3, 3], Orientation.Vertical));
myGameboard.placeShip(new Ship(Name.Battleship, [0, 2], Orientation.Vertical));
myGameboard.placeShip(new Ship(Name.Cruiser, [7, 9], Orientation.Horizontal));
myGameboard.createAttack([4, 0]);
myGameboard.createAttack([3, 3]);

// Create board
const gameboard1 = document.querySelector(".gameboard") as HTMLElement;
createBoard(gameboard1);

// Render ships
myGameboard.ships.forEach((ship) => renderShip(ship, gameboard1));

/* 
const allCells: Cell[] = ([] as Cell[]).concat(...myGameboard.board);

// Render gameboard based on gameboard.board
allCells.forEach((cellData, index) => {
  const cell: HTMLDivElement = document.createElement("div");
  cell.className = "cell";
  cell.id = "cell" + index;
  if (cellData.ship) {
    cell.classList.add("ship");
    // Add drag-and-drop event listeners
    cell.setAttribute("draggable", "true");

    cell.addEventListener("dragstart", (event: DragEvent) => {
      event.dataTransfer?.setData("text/plain", index.toString());
      cell.classList.add("dragging");
    });

    cell.addEventListener("dragend", () => {
      cell.classList.remove("dragging");
    });
  }
  gameboard.appendChild(cell);
});
 */
