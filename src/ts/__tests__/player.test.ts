import { Name, Orientation, Ship } from "../classes/ship";
import { Player, Role } from "../classes/player";

describe("Player", () => {
  let player: Player;
  let carrier: Ship;

  beforeEach(() => {
    player = new Player(Role.Player);
    carrier = new Ship(Name.Carrier, [0, 0], Orientation.Horizontal);
  });

  describe("placeShip", () => {
    it("should place a cloned ship in player.ships", () => {
      player.placeShip(carrier);

      expect(player.ships).toHaveLength(1);

      const placedShip = player.ships[0];
      expect(placedShip).not.toBe(carrier); // Reference inequality
      expect(placedShip).toEqual(carrier); // Same properties
    });
  });

  describe("moveShip", () => {
    const initialPosition: [number, number] = [0, 0];
    const newPosition: [number, number] = [1, 1];

    it("should update ship position correctly", () => {
      player.moveShip(carrier, newPosition);

      expect(carrier.position).toEqual(newPosition);
    });

    it("should revert ship position on invalid placement", () => {
      // Mock isInvalidPlacement to always return true
      jest.spyOn(player, "isInvalidPlacement").mockReturnValue(true);

      player.moveShip(carrier, newPosition);

      expect(carrier.position).toEqual(initialPosition);
    });
  });

  describe("switchShipOrientation", () => {
    it("should switch the ship orientation correctly", () => {
      player.switchShipOrientation(carrier);

      expect(carrier.orientation).toEqual(Orientation.Vertical);

      player.switchShipOrientation(carrier);

      expect(carrier.orientation).toEqual(Orientation.Horizontal);
    });

    it("should not change orientation if smart move is false", () => {
      player.moveToClosestValidPosition = jest.fn(() => false);

      player.switchShipOrientation(carrier);

      expect(carrier.orientation).toEqual(Orientation.Horizontal);
    });
  });

  describe("findShipByCoord", () => {
    it("should find a ship by coordinates", () => {
      player.placeShip(carrier);
      player.syncShipsToBoard();

      var foundShip = player.findShipByCoord([0, 0]);

      expect(foundShip).toEqual(carrier);

      foundShip = player.findShipByCoord([9, 9]);

      expect(foundShip).toBe(undefined);
    });
  });

  describe("createAttack", () => {
    it("should create an attack and update board and ships", () => {
      player.ships.push(carrier);
      player.syncShipsToBoard();

      player.createAttack([0, 0]); // Needs the data in board

      expect(player.board[0].hit).toBe(true);
      expect(carrier.hits).toEqual(1);
    });
  });

  describe("synchShipsToBoard", () => {
    it("should sync ships to the board correctly", () => {
      player.placeShip(carrier);
      player.syncShipsToBoard();

      player.createAttack([0, 0]);

      player.syncShipsToBoard();

      expect(player.board[0]).toEqual({ ship: Name.Carrier, hit: true });
      expect(player.board[1]).toEqual({ ship: Name.Carrier, hit: false });
      expect(player.board[2]).toEqual({ ship: Name.Carrier, hit: false });
      expect(player.board[3]).toEqual({ ship: Name.Carrier, hit: false });
      expect(player.board[4]).toEqual({ ship: Name.Carrier, hit: false });
    });
  });
});
