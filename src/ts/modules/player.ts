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
    this.ships.push(clonedShip);
  }

  moveShip(ship: Ship, newPosition: [number, number]): void {
    const initialPosition = ship.position;
    ship.position = newPosition;

    if (this.isInvalidPlacement(ship)) {
      console.log("Invalid placement.");
      ship.position = initialPosition;
    }
  }

  switchShipOrientation(ship: Ship): void {
    const initialPosition: [number, number] = [...ship.position];
    const initialOrientation: Orientation = ship.orientation;

    if (ship.orientation === Orientation.Vertical) {
      ship.orientation = Orientation.Horizontal;
    } else {
      ship.orientation = Orientation.Vertical;
    }

    const smartMove = this.moveToClosestValidPosition(ship, ship.position);

    if (!smartMove) {
      console.log("Smart move could not be found");
      ship.position = initialPosition;
      ship.orientation = initialOrientation;
    }
  }

  syncShipsToBoard() {
    this.ships.forEach((ship) => {
      ship.coordinates.forEach(([x, y]) => {
        const index = x + y * 10;
        this.board[index] = { ship: ship.name, hit: false };
      });
    });
  }

  restartBoard(): void {
    this.board = Array.from({ length: 100 }, () => ({ ship: null, hit: false }));
  }

  populateRandomly(): void {
    this.ships = [];

    const shipNames = [Name.Battleship, Name.Carrier, Name.Cruiser, Name.Destroyer, Name.Submarine];

    for (const shipName of shipNames) {
      const newShip = new Ship(shipName, this.getRandomCoordinate(), this.getRandomOrientation());

      while (this.isInvalidPlacement(newShip)) {
        newShip.position = this.getRandomCoordinate();
      }

      this.placeShip(newShip);
    }
  }

  // Experimental method
  moveToClosestValidPosition(ship: Ship, desiredPosition: [number, number]): boolean {
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
      [4, 0],
      [0, 4],
      [-4, 0],
      [0, -4],
      [5, 0],
      [0, 5],
      [-5, 0],
      [0, -5],
      // ... can be further expanded if needed
    ];

    ship.position = [...desiredPosition];

    // Apply every step until one places ship in a valid position
    for (const step of explorationSteps) {
      if (!this.isInvalidPlacement(ship)) {
        console.log("Valid position found!: " + ship.position);
        return true;
      }

      // Restore original desired positon
      ship.position = [...desiredPosition];

      // Apply a new exploration step
      const [dx, dy] = step;
      ship.position = [desiredPosition[0] + dx, desiredPosition[1] + dy];
    }

    // No succesful position was found, so restore initial
    ship.position = initialPosition;
    return false;
  }

  createAttack(position: [number, number]): void {
    const [x, y] = position;

    if (this.isInvalidAttack(position)) {
      throw new Error("Duplicate attack. Choose another one 🔄");
    }

    // Add attack to board
    this.board[x + y * 10].hit = true;

    // Add attack to ships
    if (this.findShipByCoord(position)) {
      (this.findShipByCoord(position) as Ship).hit();
    }
  }

  createRandomUnrepAttack(): void {
    let randomCoord = this.getRandomCoordinate();

    while (this.isInvalidAttack(randomCoord)) {
      randomCoord = this.getRandomCoordinate();
    }

    this.createAttack(randomCoord);
  }

  async createDelayedRandomUnrepAttack(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.createRandomUnrepAttack();
        resolve();
      }, 1200);
    });
  }

  findShipByCoord(position: [number, number]): Ship | undefined {
    const [x, y] = position;
    const attackedShip = this.board[x + y * 10].ship as string;
    return this.findShipByName(attackedShip);
  }

  findShipByName(name: String): Ship | undefined {
    return this.ships.find((ship) => ship.name === name);
  }

  hasLost(): boolean {
    return this.ships.every((ship) => ship.sunk);
  }

  isInvalidPlacement(candidateShip: Ship): boolean {
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

    // Return true if ship overlaps or is out of bounds
    return hasOverlap || isOutOfBounds;
  }

  isInvalidAttack(position: [number, number]): boolean {
    const [x, y] = position;
    return this.board[x + y * 10].hit;
  }

  private getRandomCoordinate(): [number, number] {
    const randomX = Math.floor(Math.random() * 10);
    const randomY = Math.floor(Math.random() * 10);

    return [randomX, randomY];
  }

  private getRandomOrientation(): Orientation {
    const randomNumber = Math.floor(Math.random() * 2);

    return randomNumber === 0 ? Orientation.Horizontal : Orientation.Vertical;
  }
}
