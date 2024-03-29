import { Name, Orientation, Ship } from "../classes/ship";

describe("Ship Class", () => {
  let ship: Ship;

  beforeEach(() => {
    ship = new Ship(Name.Carrier, [0, 0], Orientation.Horizontal);
  });

  describe("Ship", () => {
    it("should be created with the correct properties", () => {
      expect(ship.name).toBe(Name.Carrier);
      expect(ship.length).toBe(5); // Carrier length
      expect(ship.position).toEqual([0, 0]);
      expect(ship.orientation).toBe(Orientation.Horizontal);
      expect(ship.hits).toBe(0);
      expect(ship.sunk).toBe(false);
    });
  });

  describe("hit", () => {
    it("should increase the hit property correctly", () => {
      ship.hit();
      expect(ship.hits).toBe(1);
      expect(ship.sunk).toBe(false);

      for (let i = 1; i < ship.length; i++) {
        ship.hit();
      }

      expect(ship.hits).toBe(ship.length);
      expect(ship.sunk).toBe(true);
    });
  });

  describe("isSunk", () => {
    it("should check if the ship is sunk", () => {
      expect(ship.isSunk()).toBe(false);

      for (let i = 0; i < ship.length; i++) {
        ship.hit();
      }

      expect(ship.isSunk()).toBe(true);
    });
  });

  describe("get coordinates", () => {
    it("should return correct coordinates", () => {
      const coordinates = ship.coordinates;

      expect(coordinates.length).toBe(ship.length);

      for (let i = 0; i < ship.length; i++) {
        expect(coordinates[i]).toEqual([0 + i, 0]);
      }

      // Test for a ship with vertical orientation
      const verticalShip = new Ship(Name.Battleship, [3, 3], Orientation.Vertical);
      const verticalCoordinates = verticalShip.coordinates;

      expect(verticalCoordinates.length).toBe(verticalShip.length);

      for (let i = 0; i < verticalShip.length; i++) {
        expect(verticalCoordinates[i]).toEqual([3, 3 + i]);
      }
    });
  });

  describe("clone", () => {
    it("should clone the ship correctly", () => {
      ship.hit();
      const clonedShip = ship.clone();

      // Verify they have equal properties
      expect(clonedShip).toEqual(ship);

      // Verify the clone is a different instance (reference inequality)
      expect(clonedShip).not.toBe(ship);
    });
  });
});
