class Ship {
  name: string;
  size: number;
  orientation: "horizontal" | "vertical";
  position: number;
  hits: number;
  isSunk: boolean;

  constructor(
    name: string,
    size: number,
    orientation: "horizontal" | "vertical",
    position: number
  ) {
    this.name = name;
    this.size = size;
    this.orientation = orientation;
    this.position = position;
    this.hits = 0;
    this.isSunk = false;
  }

  hit() {
    this.hits++;
    if (this.hits === this.size) {
      this.isSunk = true;
    }
  }
}

// Example instances

const carrier: Ship = new Ship("Carrier", 5, "horizontal", 12);
const battleship: Ship = new Ship("Battleship", 4, "vertical", 8);
const cruiser: Ship = new Ship("Cruiser", 3, "horizontal", 15);
const submarine: Ship = new Ship("Submarine", 3, "vertical", 3);
const destroyer: Ship = new Ship("Destroyer", 2, "horizontal", 10);

// Example object

const example = {
  name: "Carrier",
  size: 5,
  orientation: "horizontal",
  position: 12,
  hits: 0,
  isSunk: false,
};
