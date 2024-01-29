export enum Name {
  Carrier = "Carrier",
  Battleship = "Battleship",
  Cruiser = "Cruiser",
  Submarine = "Submarine",
  Destroyer = "Destroyer",
}

export enum Orientation {
  Horizontal = 90,
  Vertical = 0,
}

export class Ship {
  name: Name;
  length: number;
  position: [number, number];
  orientation: Orientation;
  hits: number;
  sunk: boolean;

  static lengths: { [key in Name]: number } = {
    Carrier: 5,
    Battleship: 4,
    Cruiser: 3,
    Submarine: 3,
    Destroyer: 2,
  };

  constructor(name: Name, position: [number, number], orientation: Orientation) {
    this.name = name;
    this.length = Ship.lengths[name];
    this.position = position;
    this.orientation = orientation;
    this.hits = 0;
    this.sunk = false;
  }

  hit(): void {
    this.hits += 1;
    if (this.hits === this.length) {
      this.sunk = true;
    }
  }

  isSunk(): boolean {
    return this.sunk;
  }

  get coordinates(): [number, number][] {
    const coordinates: [number, number][] = [];
    let [x, y] = this.position;

    for (let i = 0; i < this.length; i++) {
      coordinates.push([x, y]);

      if (this.orientation === Orientation.Horizontal) {
        x += 1;
      } else {
        y += 1;
      }
    }

    return coordinates;
  }

  clone(): Ship {
    // Create a new instance with the same properties
    const clonedShip = new Ship(this.name, this.position, this.orientation);
    clonedShip.hits = this.hits;
    clonedShip.sunk = this.sunk;
    return clonedShip;
  }
}
