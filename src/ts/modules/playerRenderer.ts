import { Orientation, Ship } from "./ship";
import { Player, Role } from "./player";
import interact from "interactjs";

export class PlayerRenderer {
  player: Player;
  boardContainer: HTMLElement;
  cellSize: number;
  angle: number;

  constructor(player: Player) {
    this.player = player;
    this.boardContainer = document.querySelector("." + this.player.role) as HTMLElement;
    this.cellSize = 47;
    this.angle = 0;
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
    const existingShip = this.boardContainer.querySelector(`.Carrier`);
    if (existingShip) {
      existingShip.remove();
    }

    // Create ship div
    let shipImg = new Image();
    shipImg.src = `images/carrier.png`;
    shipImg.classList.add(ship.name, "ship");
    this.addInteract(shipImg);
    this.boardContainer.appendChild(shipImg);

    // Find pixel coordinates of ship
    const topValue = `${y * this.cellSize}px`;
    const leftValue = `${x * this.cellSize}px`;

    // Render dimensions acoording to orientation
    shipImg.width = this.cellSize;
    shipImg.height = ship.length * this.cellSize;

    if (ship.orientation === Orientation.Horizontal) {
      this.angle = -90;
      shipImg.style.transform = `translate(0px, 0px) rotate(${this.angle}deg)`;
    }

    // Position ship
    shipImg.style.top = topValue;
    shipImg.style.left = leftValue;
  }

  addInteract(element: HTMLElement): void {
    var x = 0;
    var y = 0;

    function toggleAngle(angle: number): number | undefined {
      if (angle === 0) {
        return -90;
      } else if (angle === -90) {
        return 0;
      }
    }

    interact(element)
      .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: "parent",
            endOnly: true,
          }),
        ],
        // enable autoScroll
        autoScroll: true,

        listeners: {
          // call this function on every dragmove event
          move: (event) => {
            element.classList.remove("transition");

            x += event.dx;
            y += event.dy;

            event.target.style.transform = `translate(${x}px, ${y}px) rotate(${this.angle}deg)`;
          },

          // call this function on every dragend event
          end: (event) => {
            const stackingElements = document.elementsFromPoint(event.clientX, event.clientY);

            var divRect = element.getBoundingClientRect();
            if (this.player.ships[0].orientation === Orientation.Vertical) {
              var xDelta = Math.floor((event.clientX - divRect.left) / this.cellSize);
              var yDelta = Math.floor((event.clientY - divRect.top) / this.cellSize);
            } else {
              var xDelta = Math.floor((event.clientY - divRect.left) / this.cellSize);
              var yDelta = Math.floor((event.clientX - divRect.top) / this.cellSize);
            }

            xDelta = 0;
            yDelta = 0;

            const dropCell = stackingElements[1] as HTMLElement;
            const [x, y] = JSON.parse(dropCell.id);

            this.player.moveToClosestValidPosition(this.player.ships[0], [x - xDelta, y - yDelta]);
            this.renderShips();
            console.log(this.player.ships[0].coordinates);
          },
        },
      })

      .on("tap", (event) => {
        element.classList.add("transition");

        this.angle = toggleAngle(this.angle) as number;
        event.target.style.transform = `translate(${x}px, ${y}px) rotate(${this.angle}deg)`;

        this.player.ships[0].toggleOrientation();
        setTimeout(() => {
          this.renderShips();
        }, 1000);
      });
  }

  private toggleAngle() {
    if (this.angle === 0) {
      return -90;
    } else if (this.angle === -90) {
      return 0;
    }
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
