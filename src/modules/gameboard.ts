import { Name, Orientation, Ship } from "./ship";

interface Cell {
  ship: Name | null;
  hit: boolean;
}

class Gameboard {
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
    if (this.checkForOverlap(ship)) {
      console.error("Cannot place ship. Overlaps with an existing ship.");
      return;
    }

    // Add ship to list
    this.ships.push(ship);

    // Add ship to board
    const { name, length, position, orientation } = ship;
    const [startingRow, startingCol] = position;

    if (orientation === Orientation.Vertical) {
      for (let i = 0; i < length; i++) {
        this.board[startingRow + i][startingCol].ship = name;
      }
    } else {
      for (let i = 0; i < length; i++) {
        this.board[startingRow][startingCol + i].ship = name;
      }
    }
  }

  private checkForOverlap(newShip: Ship): boolean {
    // Check if the new ship overlaps with any existing ships
    const { position, length, orientation } = newShip;
    const [startingRow, startingCol] = position;

    if (orientation === Orientation.Vertical) {
      for (let i = 0; i < length; i++) {
        if (this.board[startingRow + i][startingCol].ship !== null) {
          return true; // Overlaps with an existing ship
        }
      }
    } else {
      for (let i = 0; i < length; i++) {
        if (this.board[startingRow][startingCol + i].ship !== null) {
          return true; // Overlaps with an existing ship
        }
      }
    }

    return false; // No overlap with existing ships
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

// Example usage
const myGameboard = new Gameboard();

// Add ships
myGameboard.placeShip(new Ship(Name.Destroyer, [4, 0], Orientation.Horizontal));
myGameboard.placeShip(new Ship(Name.Carrier, [3, 3], Orientation.Vertical));

// Create attacks
myGameboard.createAttack([4, 0]);
myGameboard.createAttack([3, 3]);

console.log(myGameboard.board[3][3]);
console.log(myGameboard.ships);
