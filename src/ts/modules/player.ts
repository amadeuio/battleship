import { Name, Orientation, Ship } from "./ship";

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
    const clonedShip = ship.clone();

    // Move invalid placement to valid before pushing to the list
    this.moveToClosestValidPosition(clonedShip, clonedShip.position);

    this.ships.push(clonedShip);
  }

  moveShip(ship: Ship, newPosition: [number, number]): void {
    const initialPosition = ship.position;
    ship.position = newPosition;

    if (!this.isValidPlacement(ship)) {
      console.log("Invalid placement.");
      ship.position = initialPosition;
    }
  }

  // Experimental method
  moveToClosestValidPosition(ship: Ship, desiredPosition: [number, number]): void {
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

    ship.position = [...desiredPosition];

    // Apply every step until one places ship in a valid position
    for (const step of explorationSteps) {
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

  isValidPlacement(candidateShip: Ship): boolean {
    // Flat array with coordinates of all ships except candidate
    const existingCoordinates = this.ships
      .filter((ship) => ship !== candidateShip)
      .flatMap((ship) => ship.coordinates);

    const hasOverlap = candidateShip.coordinates.some(([x, y]) =>
      existingCoordinates.some(([ex, ey]) => x === ex && y === ey)
    );

    const isOutOfBounds = candidateShip.coordinates.some(
      ([x, y]) => x < 0 || x >= 10 || y < 0 || y >= 10
    );

    // Return false if ship overlaps or is out of bounds
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

  findShip(position: [number, number]): Ship | undefined {
    const [startingRow, startingCol] = position;
    const attackedShip = this.board[startingCol * 10 + startingRow].ship;
    return this.ships.find((ship) => ship.name === attackedShip);
  }

  createAttack(position: [number, number]): void {
    const [startingRow, startingCol] = position;

    if (this.board[startingCol * 10 + startingRow].hit) {
      throw new Error("Duplicate attack. Choose another one 🔄");
    }

    // Add attack to board
    this.board[startingCol * 10 + startingRow].hit = true;

    // Add attack to ships
    if (this.findShip(position)) {
      (this.findShip(position) as Ship).hit();
    }
  }

  hasLost(): boolean {
    return this.ships.every((ship) => ship.sunk);
  }

  populateRandomly(): void {
    console.log(this.getRandomCoordinate());
    console.log(this.getRandomOrientation());
  }

  private getRandomCoordinate(): [number, number] {
    const randomX = Math.floor(Math.random() * 10);
    const randomY = Math.floor(Math.random() * 10);

    return [randomX, randomY];
  }

  private getRandomOrientation(): Orientation {
    const randomNumber = Math.floor(Math.random() * 2);

    if (randomNumber === 0) {
      return Orientation.Horizontal;
    } else {
      return Orientation.Vertical;
    }
  }
}
