import tile from "/images/tile.png";
import tileGreen from "/images/tile_green.png";
import tileRed from "/images/tile_red.png";
import Carrier from "/images/Carrier.png";
import Battleship from "/images/Battleship.png";
import Cruiser from "/images/Cruiser.png";
import Submarine from "/images/Submarine.png";
import Destroyer from "/images/Destroyer.png";

import { Ship } from "./ship";
import { Player, Role } from "./player";

import interact from "interactjs";

export class PlayerRenderer {
  player: Player;
  htmlBoard: HTMLDivElement;
  htmlCells: HTMLDivElement[];
  htmlShips: HTMLImageElement[];
  cellSize: number;

  constructor(player: Player) {
    this.player = player;
    this.htmlBoard = document.querySelector("." + this.player.role) as HTMLDivElement;
    this.htmlCells = [];
    this.htmlShips = [];
    this.cellSize = this.setCellSize();
    this.handleResize();
  }

  static shipImages = {
    Carrier,
    Battleship,
    Cruiser,
    Submarine,
    Destroyer,
  };

  createBoard() {
    for (let row = 9; row >= 0; row--) {
      for (let col = 0; col < 10; col++) {
        let htmlCell = document.createElement("div");
        htmlCell.classList.add(this.player.role + "-cell");

        const coordinates = [col, row];
        htmlCell.id = JSON.stringify(coordinates);

        this.htmlCells.push(htmlCell);
        this.htmlBoard.appendChild(htmlCell);
      }
    }
  }

  renderAttacks() {
    // Restore blank cells
    this.htmlCells.forEach((htmlCell) => {
      htmlCell.style.backgroundImage = `url(${tile})`;

      if (this.player.role === Role.Opponent) {
        htmlCell.classList.remove("default-cursor");
      }
    });

    if (this.player.role === Role.Player) {
      for (let i = 0; i < this.player.board.length; i++) {
        const htmlCell = this.htmlCells[i] as HTMLImageElement;
        const [x, y] = JSON.parse(htmlCell.id);
        const j = x + 10 * y; // transform coords

        const objCell = this.player.board[j];

        if (objCell.hit) {
          htmlCell.style.backgroundImage = `url(${tileGreen})`;
          if (objCell.ship) {
            htmlCell.style.backgroundImage = `url(${tileRed})`;
          }
        }
      }
    }

    if (this.player.role === Role.Opponent) {
      for (let i = 0; i < this.player.board.length; i++) {
        const htmlCell = this.htmlCells[i] as HTMLImageElement;
        const [x, y] = JSON.parse(htmlCell.id);
        const j = x + 10 * y;

        const objCell = this.player.board[j];

        if (objCell.hit) {
          htmlCell.style.backgroundImage = `url(${tileGreen})`;
          htmlCell.classList.add("default-cursor");
          if (objCell.ship) {
            htmlCell.style.backgroundImage = `url(${tileRed})`;
          }
        }
      }
    }
  }

  renderShip(ship: Ship) {
    const [x, y] = ship.position;

    // Remove existing ship with the same name
    const existingShip = this.htmlBoard.querySelector(`.${ship.name}`);
    if (existingShip) {
      existingShip.remove();
    }

    // Create ship div
    let htmlShip = new Image();
    htmlShip.src = PlayerRenderer.shipImages[ship.name];
    htmlShip.classList.add(ship.name, "ship");
    htmlShip.draggable = false; // uses interact.js instead
    if (this.player.role === Role.Player) {
      this.addInteract(htmlShip);
    }
    this.htmlShips.push(htmlShip);
    this.htmlBoard.appendChild(htmlShip);

    // Find pixel coordinates of ship
    const bottomValue = `${y * this.cellSize}px`;
    const leftValue = `${x * this.cellSize - 2}px`; // -2 offset image asymmetry

    // Render dimensions
    htmlShip.width = this.cellSize;
    htmlShip.height = ship.length * this.cellSize;
    htmlShip.style.transform = `translate(0px, 0px) rotate(${ship.orientation}deg)`;

    // Position ship
    htmlShip.style.bottom = bottomValue;
    htmlShip.style.left = leftValue;
  }

  renderAttackAnimation(position: [number, number]): void {
    const [x, y] = position;
    const j = x + 10 * y;

    const targetCell = this.htmlCells.find((htmlCell) => {
      const cellPosition = JSON.parse(htmlCell.id);
      const [cellX, cellY] = cellPosition;

      return cellX === x && cellY === y;
    });

    const spriteName: string = this.player.board[j].ship ? "explosion" : "splash";
    targetCell?.appendChild(this.createSprite(spriteName));
  }

  private createSprite(spriteName: string): HTMLDivElement {
    const spriteContainer = document.createElement("div");
    spriteContainer.classList.add(spriteName + "-sprite");

    // Define sprite properties
    const spriteWidth = this.cellSize;
    const totalSprites = 5;
    let currentSpriteIndex = 0;
    let framesToPlay = 6;

    // Update the sprite's background position
    function updateSprite() {
      const xPos = -currentSpriteIndex * spriteWidth;
      spriteContainer.style.backgroundPosition = `${xPos}px 0px`;
    }

    // Animate the sprite sheet
    function animateSprite() {
      updateSprite();

      framesToPlay--;

      if (framesToPlay === 0) {
        clearInterval(animationInterval); // Stop the animation
        spriteContainer.style.display = "none";
      }

      currentSpriteIndex = (currentSpriteIndex + 1) % totalSprites;
    }

    const animationInterval = setInterval(animateSprite, 100);
    return spriteContainer;
  }

  addInteract(htmlShip: HTMLImageElement): void {
    var x = 0;
    var y = 0;

    const draggedShipName = htmlShip.classList.item(0) as string;
    const draggedShipObj = this.player.findShipByName(draggedShipName) as Ship;

    interact(htmlShip)
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
            htmlShip.classList.remove("transition");

            x += event.dx;
            y += event.dy;

            event.target.style.transform = `translate(${x}px, ${y}px) rotate(${draggedShipObj.orientation}deg)`;
          },

          end: (event) => {
            const stackingElements = document.elementsFromPoint(event.clientX, event.clientY);

            // Mouse grab position relative to ship
            var divRect = htmlShip.getBoundingClientRect();
            var xDelta = Math.floor((event.clientX - divRect.left) / this.cellSize);
            var yDelta = Math.floor((divRect.bottom - event.clientY) / this.cellSize);

            var dropCell = stackingElements[1] as HTMLElement;

            // Edge case: Placement on top of an existing ship
            if (!dropCell.id) {
              dropCell = stackingElements[2] as HTMLElement;
            }

            const [x, y] = JSON.parse(dropCell.id);

            this.player.moveToClosestValidPosition(draggedShipObj, [x - xDelta, y - yDelta]);
            this.renderShips();
          },
        },
      })

      .on("tap", (event) => {
        htmlShip.classList.add("transition");

        this.player.switchShipOrientation(draggedShipObj);
        event.target.style.transform = `translate(0px, 0px) rotate(${draggedShipObj.orientation}deg)`;

        // Wait for the transition effect
        setTimeout(() => {
          this.player.moveToClosestValidPosition(draggedShipObj, draggedShipObj.position);
          this.renderShips();
        }, 300);
      });
  }

  private removeInteract(htmlShip: HTMLImageElement): void {
    interact(htmlShip).unset();
  }

  addInteractToAll() {
    this.htmlShips.forEach((htmlShip) => {
      this.addInteract(htmlShip);
    });
  }

  removeInteractToAll() {
    this.htmlShips.forEach((htmlShip) => {
      this.removeInteract(htmlShip);
    });
  }

  renderShips() {
    this.player.ships.forEach((ship) => this.renderShip(ship));
  }

  clearShips() {
    this.htmlShips.forEach((htmlShip) => {
      htmlShip.remove();
    });
  }

  private handleResize() {
    window.addEventListener("resize", () => {
      this.setCellSize();
      if (this.player.role === Role.Player) {
        this.renderShips();
      }
    });
  }

  private setCellSize() {
    if (window.innerWidth < 600) {
      this.cellSize = 32;
    } else {
      this.cellSize = 47;
    }

    return this.cellSize;
  }
}
