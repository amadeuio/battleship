import { Name, Ship } from "./ship";

export interface Cell {
  ship: Name | null;
  hit: boolean;
}

export class Gameboard {
  board: Cell[][];
  ships: Ship[];

  constructor() {
    // Construct 10x10 array of arrays with { ship: null, hit: false } cells
    this.board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({ ship: null, hit: false }))
    );
    this.ships = [];
  }

  placeShip(ship: Ship): void {
    // Check for overlap with existing ships
    // IDEA: Instead of throwing an error, put ship in the closest available position
    if (this.checkForOverlap(ship)) {
      console.error("Cannot place ship. Overlaps with an existing ship.");
      return;
    }

    // Add ship to list
    this.ships.push(ship);

    // Add ship to board
    ship.calcCoordinates().forEach(([row, col]) => {
      this.board[row][col].ship = ship.name;
    });
  }

  private checkForOverlap(newShip: Ship): boolean {
    // Check if the new ship overlaps with any existing ships
    return newShip.calcCoordinates().some(([row, col]) => {
      return this.board[row][col].ship !== null;
    });
  }

  removeShip(ship: Ship): void {
    // Find the index of the ship in the ships array
    const shipIndex = this.ships.findIndex((s) => s === ship);

    // If the ship is not found, log an error and return
    if (shipIndex === -1) {
      console.error("Ship not found. Cannot remove.");
      return;
    }

    // Remove ship from the ships array
    this.ships.splice(shipIndex, 1);

    // Remove ship from the board
    ship.calcCoordinates().forEach(([row, col]) => {
      this.board[row][col].ship = null;
    });
  }

  moveShip(ship: Ship, newPosition: [number, number]): void {
    // Remove the ship from its current position on the board
    ship.calcCoordinates().forEach(([row, col]) => {
      this.board[row][col].ship = null;
    });

    // Update the ship's position
    ship.position = newPosition;

    // Check for overlap with other ships in the new position
    if (this.checkForOverlap(ship)) {
      console.error("Cannot move ship. Overlaps with an existing ship.");

      // Move the ship back to its original position
      ship.calcCoordinates().forEach(([row, col]) => {
        this.board[row][col].ship = ship.name;
      });

      return;
    }

    // Update the ship's position on the board
    ship.calcCoordinates().forEach(([row, col]) => {
      this.board[row][col].ship = ship.name;
    });
  }

  createAttack(position: [number, number]): void {
    const [startingRow, startingCol] = position;

    // Check if the cell has already been hit
    if (this.board[startingRow][startingCol].hit) {
      console.error("Duplicate attack. This cell has already been hit.");
      return;
    }

    // Add attack to board
    this.board[startingRow][startingCol].hit = true;

    // Add attack to ship
    const attackedShip = this.board[startingRow][startingCol].ship;
    this.ships.find((ship) => ship.name === attackedShip)?.hit();
  }
}

/* 
// Example usage
const myGameboard = new Gameboard();

// Add ships
myGameboard.placeShip(new Ship(Name.Destroyer, [4, 0], Orientation.Horizontal));
myGameboard.placeShip(new Ship(Name.Carrier, [3, 3], Orientation.Vertical));

// Create attacks
myGameboard.createAttack([4, 0]);
myGameboard.createAttack([3, 3]); 
*/

/*
// Idea: move to closest leagal position implementation
isPositionLegal()

MoveToClosestLegalPosition() {
  while (!isPositionLegal()) {
      // keep trying positions
      // by moving one step at a time
  }
} 
*/
