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
    // IDEA: Instead of throwing an error, put ship in the closest available position
    if (this.checkForOverlap(ship)) {
      console.error("Cannot place ship. Overlaps with an existing ship.");
      console.log("err");
      return;
    }

    // Add ship to list
    this.ships.push(ship);

    // Add ship to board
    ship.coordinates.forEach(([row, col]) => {
      this.board[col * 10 + row].ship = ship.name;
    });
  }

  private checkForOverlap(newShip: Ship): boolean {
    // Check if the new ship overlaps with any existing ships
    return newShip.coordinates.some(([row, col]) => {
      return this.board[col * 10 + row].ship !== null;
    });
  }

  moveShip(ship: Ship, newPosition: [number, number]): void {
    // Remove the ship from its current position on the board
    ship.coordinates.forEach(([row, col]) => {
      this.board[col * 10 + row].ship = null;
    });

    // Save the original position for potential revert
    const originalPosition = ship.position;

    // Update the ship's position
    ship.position = newPosition;

    // Check for overlap with other ships in the new position
    if (this.checkForOverlap(ship)) {
      console.error("Cannot move ship. Overlaps with an existing ship.");

      // Move the ship back to its original position
      ship.coordinates.forEach(([row, col]) => {
        this.board[col * 10 + row].ship = ship.name;
      });

      // Revert the ship's position to its original value
      ship.position = originalPosition;

      return;
    }

    // Update the ship's position on the board
    ship.coordinates.forEach(([row, col]) => {
      this.board[col * 10 + row].ship = ship.name;
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

    // Add attack to ship
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
