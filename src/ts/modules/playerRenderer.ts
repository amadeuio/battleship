import { Ship } from "./ship";
import { Player } from "./player";

export class PlayerRenderer {
  player: Player;
  boardContainer: HTMLElement;

  constructor(player: Player) {
    this.player = player;
    this.boardContainer = document.createElement("div");
    this.boardContainer.className = this.player.role;
  }

  createBoard() {
    const boardContainer = document.createElement("div");
    boardContainer.className = this.player.role;

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        // Create div
        const boardCell = document.createElement("div");
        boardCell.className = this.player.role + "-cell";

        // Set the id of the div to be its coordinates
        const coordinates: [number, number] = [col, row];
        boardCell.id = JSON.stringify(coordinates);

        this.boardContainer.appendChild(boardCell);
      }
    }

    document.body.appendChild(this.boardContainer);
  }

  renderAttacks() {
    const board = this.player.attacks;

    // Flatten the board matrix column-wise
    const transposedBoard = board[0].map((_, i) => board.map((row) => row[i]));
    const boardList = transposedBoard.flat();

    // Select html grid items inside specified gameboard
    var htmlCells = this.boardContainer.getElementsByClassName(this.player.role + "-cell");

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

    this.player.ships.forEach((ship) => renderShip(ship, this.boardContainer));
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
        const droppedShip = this.player.ships.find((ship) => ship.name === droppedClass);

        if (droppedShip) {
          // Find the position in which the ship has been dropped
          const dropCell = (event.target as HTMLElement).closest(`.${this.player.role}-cell`);

          if (dropCell) {
            // Update the gameboard with the new position
            const [x, y] = JSON.parse(dropCell.id);
            this.player.moveShip(droppedShip, [x, y]);

            // Render updated ship
            this.renderShips();
          }
        }
      }
    });
  }
}
