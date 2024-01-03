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
    // Add ship to list
    this.ships.push(ship);

    // Add ship to board
    const { name, length, position, orientation } = ship;
    const startingRow = Math.floor(position / 10);
    const startingCol = position % 10;

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

  createAttack(position: number): void {
    const startingRow = Math.floor(position / 10);
    const startingCol = position % 10;

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
myGameboard.placeShip(new Ship(Name.Destroyer, 0, Orientation.Horizontal));
myGameboard.placeShip(new Ship(Name.Carrier, 10, Orientation.Horizontal));

// Create attacks
myGameboard.createAttack(0);
myGameboard.createAttack(15);

console.log(myGameboard.ships);
