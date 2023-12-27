class Ship {
  size: number;
  hits: number;
  sunk: boolean;

  constructor(size: number, hits: number) {
    this.size = size;
    this.hits = hits;
    this.sunk = this.isSunk();
  }

  hit(): void {
    this.hits = this.hits + 1;
  }

  isSunk(): boolean {
    return this.size === this.hits;
  }
}

export default Ship;
