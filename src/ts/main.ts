import "../styles/reset.css";
import "../styles/style.css";

import { Name, Orientation, Ship } from "./modules/ship";
import { Gameboard, Cell } from "./modules/gameboard";

// Create data
const myGameboard = new Gameboard();
myGameboard.placeShip(new Ship(Name.Destroyer, [5, 5], Orientation.Horizontal));
myGameboard.placeShip(new Ship(Name.Carrier, [3, 3], Orientation.Vertical));
myGameboard.placeShip(new Ship(Name.Battleship, [0, 2], Orientation.Vertical));
myGameboard.placeShip(new Ship(Name.Cruiser, [7, 9], Orientation.Horizontal));

myGameboard.createAttack([4, 0]);
myGameboard.createAttack([3, 3]);

// Get the grid container
const gameboard = document.querySelector(".gameboard") as HTMLElement;
const allCells: Cell[] = ([] as Cell[]).concat(...myGameboard.board);

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
