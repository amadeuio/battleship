import { Orientation, Ship } from "./ship";
import { Player, Role } from "./player";
import interact from "interactjs";

export class PlayerRenderer {
  player: Player;
  boardContainer: HTMLElement;
  cellSize: number;

  constructor(player: Player) {
    this.player = player;
    this.boardContainer = document.querySelector("." + this.player.role) as HTMLElement;
    this.cellSize = 47;
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
    let shipImg = new Image();
    shipImg.src = `images/${ship.name}.png`;
    shipImg.classList.add(ship.name, "ship");
    this.addInteract(shipImg);
    this.boardContainer.appendChild(shipImg);

    // Render dimensions
    shipImg.width = this.cellSize;
    shipImg.height = ship.length * this.cellSize;

    // Rotate if necessary
    if (ship.orientation === Orientation.Horizontal) {
      const angle = -90;
      shipImg.style.transform = `translate(0px, 0px) rotate(${angle}deg)`;
    }

    // Find pixel coordinates of ship
    const topValue = `${y * this.cellSize}px`;
    const leftValue = `${x * this.cellSize - 3}px`; // -3 offsets non symetrical image

    // Position ship
    shipImg.style.top = topValue;
    shipImg.style.left = leftValue;
  }

  addInteract(element: HTMLElement): void {
    var x = 0;
    var y = 0;
    var angle = 0;

    const draggedShipName = element.classList.item(0) as string;
    const draggedShipObj = this.player.findShipByName(draggedShipName) as Ship;

    function orientationToAngle(orientation: Orientation): number | undefined {
      if (orientation === Orientation.Vertical) {
        return 0;
      } else if (orientation === Orientation.Horizontal) {
        return -90;
      }
    }

    interact(element)
      .draggable({
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: "parent",
            endOnly: true,
          }),
        ],
        autoScroll: true,

        listeners: {
          move: (event) => {
            element.classList.remove("transition");

            x += event.dx;
            y += event.dy;
            angle = orientationToAngle(draggedShipObj.orientation) as number;

            event.target.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
          },

          end: (event) => {
            const stackingElements = document.elementsFromPoint(event.clientX, event.clientY);

            // Mouse grab position relative to ship
            var divRect = element.getBoundingClientRect();
            var xDelta = Math.floor((event.clientX - divRect.left) / this.cellSize);
            var yDelta = Math.floor((event.clientY - divRect.top) / this.cellSize);

            var dropCell = stackingElements[1] as HTMLElement;

            // Edge case: Placement on top of an existing ship
            if (!dropCell.id) {
              const stackingElements = document.elementsFromPoint(event.clientX, event.clientY);
              dropCell = stackingElements[2] as HTMLElement;
            }

            const [x, y] = JSON.parse(dropCell.id);

            this.player.moveToClosestValidPosition(draggedShipObj, [x - xDelta, y - yDelta]);
            this.renderShips();
          },
        },
      })

      .on("tap", (event) => {
        element.classList.add("transition");

        draggedShipObj.toggleOrientation();
        angle = orientationToAngle(draggedShipObj.orientation) as number;
        event.target.style.transform = `translate(0px, 0px) rotate(${angle}deg)`;

        // Wait for the transition effect
        setTimeout(() => {
          this.player.moveToClosestValidPosition(draggedShipObj, draggedShipObj.position);
          this.renderShips();
        }, 300);
      });
  }

  addInteractToAll() {
    this.getHTMLShips().forEach((HTMLShip) => {
      this.addInteract(HTMLShip);
    });
  }

  renderShips() {
    this.player.ships.forEach((ship) => this.renderShip(ship));
  }

  clearShips() {
    this.getHTMLShips().forEach((HTMLShip) => {
      HTMLShip.remove();
    });
  }

  private getHTMLShips(): NodeListOf<HTMLDivElement> {
    return this.boardContainer.querySelectorAll(".ship");
  }
}
