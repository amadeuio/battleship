// Ship.test.ts
import Ship from "../modules/ship";

describe("Ship", () => {
  it("should initialize correctly", () => {
    const ship = new Ship(3, 0);

    expect(ship.size).toBe(3);
    expect(ship.hits).toBe(0);
    expect(ship.sunk).toBe(false);
  });
});
