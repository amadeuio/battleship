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

  // Takes player.board list and renders it on screen
  renderAttacks() {
    var htmlCells = this.boardContainer.getElementsByClassName(this.player.role + "-cell");

    // Restore blank cells
    for (var i = 0; i < htmlCells.length; i++) {
      var cell = htmlCells[i];
      cell.textContent = "";

      if (this.player.role === Role.Opponent) {
        cell.classList.remove("default-cursor");
        cell.classList.remove("reveal-cell");
      }
    }

    // Render player attacks on board
    if (this.player.role === Role.Player) {
      for (let i = 0; i < this.player.board.length; i++) {
        const objCell = this.player.board[i];
        const htmlCell = htmlCells[i];

        if (objCell.hit) {
          htmlCell.textContent = "🌊";
          if (objCell.ship) htmlCell.textContent = "🔥";
        }
      }
    }

    // Render opponent attacks on board
    if (this.player.role === Role.Opponent) {
      for (let i = 0; i < this.player.board.length; i++) {
        const objCell = this.player.board[i];
        const htmlCell = htmlCells[i];

        if (objCell.hit) {
          htmlCell.textContent = "🌊";
          htmlCell.classList.add("default-cursor");
          htmlCell.classList.add("reveal-cell");
          if (objCell.ship) htmlCell.textContent = "🔥";
        }
      }
    }
  }

  renderShip(ship: Ship) {
    const [x, y] = ship.position;

    // Remove existing ship with the same name
    const existingShip = this.boardContainer.querySelector(`.${ship.name}`);
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

  addDragDropAndClick(): void {
    this.boardContainer.addEventListener("click", this.handleClick);
    this.boardContainer.addEventListener("dragstart", this.handleDragStart);
    this.boardContainer.addEventListener("dragover", this.handleDragOver);
    this.boardContainer.addEventListener("drop", this.handleDrop);
  }

  removeDragDropAndClick(): void {
    this.getHTMLShips().forEach((HTMLShip) => {
      HTMLShip.classList.add("default-cursor");
      HTMLShip.draggable = false;
    });

    this.boardContainer.removeEventListener("click", this.handleClick);
    this.boardContainer.removeEventListener("dragstart", this.handleDragStart);
    this.boardContainer.removeEventListener("dragover", this.handleDragOver);
    this.boardContainer.removeEventListener("drop", this.handleDrop);
  }

  private getHTMLShips(): NodeListOf<HTMLDivElement> {
    return this.boardContainer.querySelectorAll(".ship");
  }

  private handleClick = (event: MouseEvent) => {
    const clickedHTMLShip = event.target as HTMLElement;
    const clickedShipName = clickedHTMLShip.classList.item(0) as string;
    const clickedShipObj = this.player.findShipByName(clickedShipName) as Ship;

    this.player.switchOrientation(clickedShipObj);
    this.renderShip(clickedShipObj);
  };

  private handleDragStart = (event: DragEvent) => {
    const draggedHTMLShip = event.target as HTMLElement;
    const draggedShipName = draggedHTMLShip.classList.item(0) as string;

    if (event.dataTransfer) {
      event.dataTransfer.setData("text/plain", draggedShipName);
    }
  };

  private handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  private handleDrop = (event: DragEvent) => {
    event.preventDefault();

    if (event.dataTransfer) {
      const droppedShipName = event.dataTransfer.getData("text/plain") as string;
      const droppedShipObj = this.player.findShipByName(droppedShipName) as Ship;

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
      this.player.moveToClosestValidPosition(droppedShipObj, [x, y]);

      // Render updated ship
      this.renderShips();
    }
  };
}
