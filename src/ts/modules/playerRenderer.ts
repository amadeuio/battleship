import { Ship } from "./ship";
import { Player, Role } from "./player";

export class PlayerRenderer {
  player: Player;
  boardContainer: HTMLElement;

  constructor(player: Player) {
    this.player = player;
    this.boardContainer = document.querySelector("." + this.player.role) as HTMLElement;
  }

  createBoard() {
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
  }

  // Takes player.board list, and renders it on screen
  renderAttacks() {
    // Select html grid items inside specified gameboard
    var htmlCells = this.boardContainer.getElementsByClassName(this.player.role + "-cell");

    // Iterate through board list, add 🔥 to the corresponding html divs
    if (this.player.role === Role.Player) {
      this.player.board.forEach((objCell, index) => {
        if (objCell.hit) {
          htmlCells[index].textContent = "🌊";
          if (objCell.ship) htmlCells[index].textContent = "🔥";
        }
      });
    }

    if (this.player.role === Role.Opponent) {
      // Iterate through board list, add 🔥 to the corresponding html divs
      this.player.board.forEach((objCell, index) => {
        if (objCell.hit) {
          htmlCells[index].classList.add("default-cursor");
          htmlCells[index].textContent = "🌊";
          htmlCells[index].classList.add("reveal-cell");
          if (objCell.ship) htmlCells[index].textContent = "🔥";
        }
      });
    }
  }

  renderShip(ship: Ship) {
    const [x, y] = ship.position;

    // Remove existing ship with the same name
    const existingShip = document.querySelector(`.${ship.name}`);
    if (existingShip) {
      existingShip.remove();
    }

    // Create ship div
    const shipDiv = document.createElement("div");
    shipDiv.classList.add(ship.name, "ship");
    shipDiv.setAttribute("draggable", "true");
    this.boardContainer.appendChild(shipDiv);

    // Find pixel coordinates of ship
    const cellSize = 47; // px
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

  renderShips() {
    this.player.ships.forEach((ship) => this.renderShip(ship));
  }

  getHTMLShips(): NodeListOf<HTMLDivElement> {
    return this.boardContainer.querySelectorAll(".ship");
  }

  addDragDrop(): void {
    this.boardContainer.addEventListener("dragstart", this.handleDragStart);
    this.boardContainer.addEventListener("dragover", this.handleDragOver);
    this.boardContainer.addEventListener("drop", this.handleDrop);
  }

  removeDragDrop(): void {
    this.boardContainer.removeEventListener("dragstart", this.handleDragStart);
    this.boardContainer.removeEventListener("dragover", this.handleDragOver);
    this.boardContainer.removeEventListener("drop", this.handleDrop);
  }

  private handleDragStart = (event: DragEvent) => {
    // Get the dragged ship
    const draggedShip = (event.target as HTMLElement).className;
    if (event.dataTransfer) {
      event.dataTransfer.setData("text/plain", draggedShip);
    }
  };

  private handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  private handleDrop = (event: DragEvent) => {
    event.preventDefault();

    if (event.dataTransfer) {
      // Get the ship that has been dropped
      const droppedClass = event.dataTransfer.getData("text/plain");
      const droppedShip = this.player.ships.find((ship) => ship.name === droppedClass) as Ship;

      // Find the cell in which the ship has been dropped
      let dropCell = event.target as HTMLElement;

      // Edge case: Placement on top of an existing ship
      if (!dropCell.id) {
        const stackingElements = document.elementsFromPoint(event.clientX, event.clientY);
        dropCell = stackingElements[1] as HTMLElement;
      }

      // Get the coordinates of the drop cell
      const [x, y] = JSON.parse(dropCell.id);

      // Move the dragged ship to the new position
      this.player.moveToClosestValidPosition(droppedShip, [x, y]);

      // Render updated ship
      this.renderShips();
    }
  };
}
