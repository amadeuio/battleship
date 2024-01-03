export enum Name {
  Carrier = "Carrier",
  Battleship = "Battleship",
  Cruiser = "Cruiser",
  Submarine = "Submarine",
  Destroyer = "Destroyer",
}

export enum Orientation {
  Horizontal = "Horizontal",
  Vertical = "Vertical",
}

export class Ship {
  name: Name;
  length: number;
  position: number;
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

  constructor(name: Name, position: number, orientation: Orientation) {
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
}

// Example usage

// const myShip = new Ship(Name.Cruiser, 12, Orientation.Horizontal);

// Example object

/* 
const myShipObj = {
  name: "Carrier",
  length: 5,
  position: 12,
  orientation: "Horizontal",
  hits: 0,
  sunk: false,
};
*/
