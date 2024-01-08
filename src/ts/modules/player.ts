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
  attacks: Cell[];
  ships: Ship[];
  death: boolean;

  constructor(role: Role) {
    this.role = role;
    this.nickname = "John";
    this.attacks = Array.from({ length: 100 }, () => ({ ship: null, hit: false }));
    this.ships = [];
    this.death = false;
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
      this.attacks[col * 10 + row].ship = ship.name;
    });
  }

  private checkForOverlap(newShip: Ship): boolean {
    // Check if the new ship overlaps with any existing ships
    return newShip.calcCoordinates().some(([row, col]) => {
      return this.attacks[col * 10 + row].ship !== null;
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
      this.attacks[col * 10 + row].ship = null;
    });
  }

  moveShip(ship: Ship, newPosition: [number, number]): void {
    // Remove the ship from its current position on the board
    ship.calcCoordinates().forEach(([row, col]) => {
      this.attacks[col * 10 + row].ship = null;
    });

    // Update the ship's position
    ship.position = newPosition;

    // Check for overlap with other ships in the new position
    if (this.checkForOverlap(ship)) {
      console.error("Cannot move ship. Overlaps with an existing ship.");

      // Move the ship back to its original position
      ship.calcCoordinates().forEach(([row, col]) => {
        this.attacks[col * 10 + row].ship = ship.name;
      });

      return;
    }

    // Update the ship's position on the board
    ship.calcCoordinates().forEach(([row, col]) => {
      this.attacks[col * 10 + row].ship = ship.name;
    });
  }

  createAttack(position: [number, number]): void {
    const [startingRow, startingCol] = position;

    // Check if the cell has already been hit
    if (this.attacks[startingCol * 10 + startingRow].hit) {
      console.error("Duplicate attack. This cell has already been hit.");
      return;
    }

    // Add attack to board
    this.attacks[startingCol * 10 + startingRow].hit = true;

    // Add attack to ship
    const attackedShip = this.attacks[startingCol * 10 + startingRow].ship;
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
      // by moving one step at a time
  }
} 
*/
