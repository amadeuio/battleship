// Ship.test.ts
import Ship from "../modules/ship";

describe("Ship", () => {
  it("should initialize correctly", () => {
    const ship = new Ship(3, 0);

    expect(ship.size).toBe(3);
    expect(ship.hits).toBe(0);
    expect(ship.sunk).toBe(false);
  });

  it("should increase hits when hit() is called", () => {
    const ship = new Ship(2, 0);

    ship.hit();

    expect(ship.hits).toBe(1);

    ship.hit();

    expect(ship.hits).toBe(2);
  });

  it("should correcly report a sunk ship when isSunk() is called", () => {
    const ship = new Ship(5, 0);

    expect(ship.isSunk()).toBe(false);

    ship.hits = 5; // sink it

    expect(ship.isSunk()).toBe(true);
  });
});
