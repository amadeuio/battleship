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

// Program starts

// Create data

const myGameboard = new Gameboard();

const destroyer = new Ship(Name.Destroyer, [5, 5], Orientation.Horizontal);
const carrier = new Ship(Name.Carrier, [3, 3], Orientation.Vertical);
const battleship = new Ship(Name.Battleship, [0, 2], Orientation.Vertical);
const cruiser = new Ship(Name.Cruiser, [7, 9], Orientation.Horizontal);

myGameboard.placeShip(destroyer);
myGameboard.placeShip(carrier);
myGameboard.placeShip(battleship);
myGameboard.placeShip(cruiser);

myGameboard.createAttack([4, 0]);
myGameboard.createAttack([3, 3]);

// Create board

const gameboard1 = document.querySelector(".gameboard") as HTMLElement;
createBoard(gameboard1);

// Render ships

myGameboard.ships.forEach((ship) => renderShip(ship, gameboard1));

// Drag & Drop functionality

document.addEventListener("dragstart", (event: DragEvent) => {
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
// Update the object
// Render the new ship object
document.addEventListener("drop", (event: DragEvent) => {
  event.preventDefault();

  // Get the ship that has been dropped
  if (event.dataTransfer) {
    const droppedClass = event.dataTransfer.getData("text/plain");
    const droppedShip = myGameboard.ships.find((ship) => ship.name === droppedClass);

    if (droppedShip) {
      // Find the position in which the ship has been dropped
      const dropCell = (event.target as HTMLElement).closest(".grid-item");

      if (dropCell) {
        const [x, y] = JSON.parse(dropCell.id);

        // Update ship object's position
        droppedShip.position = [x, y];

        // Render updated ship
        renderShip(droppedShip, gameboard1);
      }
    }
  }
});

// Example usage:
// const ship: Ship = {
//   name: "ship1",
//   position: [2, 3],
//   orientation: "Horizontal",
//   length: 3,
// };
// ships.push(ship);

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
