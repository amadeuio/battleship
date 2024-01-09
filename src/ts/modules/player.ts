import { Name, Ship } from "./ship";

export interface Cell {
  ship: Name | null;
  hit: boolean;
}

export enum Role {
  Player = "Player",
  Opponent = "Opponent",
}

export class Player {
  role: Role;
  nickname: string;
  board: Cell[];
  ships: Ship[];
  death: boolean;

  constructor(role: Role) {
    this.role = role;
    this.nickname = "John";
    this.board = Array.from({ length: 100 }, () => ({ ship: null, hit: false }));
    this.ships = [];
    this.death = false;
  }

  placeShip(ship: Ship): void {
    // Check for overlap with existing ships
    if (!this.isValidPlacement(ship)) {
      console.error("Cannot place ship. Overlaps with an existing ship.");
      return;
    }

    // Add ship to list
    this.ships.push(ship);
  }

  private isValidPlacement(candidateShip: Ship): boolean {
    // Flat array with coordinates of all ships except candidate
    const existingCoordinates = this.ships
      .filter((ship) => ship !== candidateShip)
      .flatMap((ship) => ship.coordinates);

    // Check for overlap with other ship coordinates
    const hasOverlap = candidateShip.coordinates.some(([x, y]) =>
      existingCoordinates.some(([ex, ey]) => x === ex && y === ey)
    );

    // Check if the ship is out of bounds
    const isOutOfBounds = candidateShip.coordinates.some(
      ([x, y]) => x < 0 || x >= 10 || y < 0 || y >= 10
    );

    // Return true if there is no overlap and the ship is not out of bounds
    return !hasOverlap && !isOutOfBounds;
  }

  moveShip(ship: Ship, newPosition: [number, number]): void {
    const initialPosition = ship.position;
    ship.position = newPosition;

    if (this.isValidPlacement(ship)) {
      console.log("Is Valid");
      ship.position = initialPosition;
    }
  }

  // Place ships on the board
  placeShipsOnBoard() {
    this.ships.forEach((ship) => {
      ship.coordinates.forEach(([x, y]) => {
        const index = y * 10 + x;
        this.board[index] = { ship: ship.name, hit: false };
      });
    });
  }

  createAttack(position: [number, number]): void {
    const [startingRow, startingCol] = position;

    // Check if the cell has already been hit
    if (this.board[startingCol * 10 + startingRow].hit) {
      console.error("Duplicate attack. This cell has already been hit.");
      return;
    }

    // Add attack to board
    this.board[startingCol * 10 + startingRow].hit = true;

    // Add attack to ships
    const attackedShip = this.board[startingCol * 10 + startingRow].ship;
    this.ships.find((ship) => ship.name === attackedShip)?.hit();
  }
}

/* 
// Example usage
const myPlayer = new Player();

// Add ships
myPlayer.placeShip(new Ship(Name.Destroyer, [4, 0], Orientation.Horizontal));
myPlayer.placeShip(new Ship(Name.Carrier, [3, 3], Orientation.Vertical));

// Create attacks
myPlayer.createAttack([4, 0]);
myPlayer.createAttack([3, 3]); 
*/

/*
// Idea: move to closest leagal position implementation
isPositionLegal()

MoveToClosestLegalPosition() {
  while (!isPositionLegal()) {
      // keep trying positions
      // by moving one random step at a time
  }
} 
*/

/*

1. Place random ships

randomShips.forEach(ship => placeShip(ships))

2. User will move ships

moveShip()
moveShip()
...

3. User will press play

placeShipsOnBoard()

4. Game will begin

createAttack()
createAttack()
...

*/
