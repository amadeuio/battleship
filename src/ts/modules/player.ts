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
      console.log("Invalid placement.");
      return;
    }

    // Add ship to list
    this.ships.push(ship);
  }

  moveShip(ship: Ship, newPosition: [number, number]): void {
    const initialPosition = ship.position;
    ship.position = newPosition;

    if (this.isValidPlacement(ship)) {
      console.log("Is Valid");
      ship.position = initialPosition;
    }
  }

  moveToClosestValidPosition(ship: Ship, desiredPosition: [number, number]): void {
    // Shallow copy of initial position
    const initialPosition: [number, number] = [...ship.position];

    // Range the function will explore
    const explorationSteps: [number, number][] = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
      [2, 0],
      [0, 2],
      [-2, 0],
      [0, -2],
      [3, 0],
      [0, 3],
      [-3, 0],
      [0, -3],
      // ... can be expanded if needed
    ];

    // Set the desired position
    ship.position = [...desiredPosition];

    // Try every step until one places ship in a valid position
    for (const step of explorationSteps) {
      // Check if position is valid
      if (this.isValidPlacement(ship)) {
        console.log("Valid position found!: " + ship.position);
        return;
      }

      // Restore original desired positon
      ship.position = [...desiredPosition];

      // Apply a new exploration step
      const [dx, dy] = step;
      ship.position = [desiredPosition[0] + dx, desiredPosition[1] + dy];
    }

    // No succesful position was found, so restore initial
    ship.position = initialPosition;
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
