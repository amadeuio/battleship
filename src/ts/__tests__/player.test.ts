import { Name, Orientation, Ship } from "../classes/ship";
import { Player, Role } from "../classes/player";

describe("Player", () => {
  let player: Player;

  beforeEach(() => {
    player = new Player(Role.Player);
  });

  it("placeShip should place a cloned ship in the player's fleet", () => {
    const originalShip = new Ship(Name.Carrier, [0, 0], Orientation.Horizontal);

    player.placeShip(originalShip);

    expect(player.ships).toHaveLength(1);

    const placedShip = player.ships[0];
    expect(placedShip).not.toBe(originalShip); // Reference inequality
    expect(placedShip).toEqual(originalShip); // Same properties
  });

  it("moveShip should update ship position correctly", () => {
    const initialPosition: [number, number] = [0, 0];
    const newPosition: [number, number] = [1, 1];
    const ship = new Ship(Name.Carrier, initialPosition, Orientation.Horizontal);

    player.moveShip(ship, newPosition);

    expect(ship.position).toEqual(newPosition);
  });

  it("moveShip should revert ship position on invalid placement", () => {
    const initialPosition: [number, number] = [0, 0];
    const newPosition: [number, number] = [1, 1];
    const ship = new Ship(Name.Carrier, initialPosition, Orientation.Horizontal);

    // Mock isInvalidPlacement to always return true for invalid placement
    player.isInvalidPlacement = jest.fn(() => true);

    player.moveShip(ship, newPosition);
    expect(ship.position).toEqual(initialPosition);
  });

  it("switchShipOrientation should switch the ship orientation correctly", () => {
    const ship = new Ship(Name.Carrier, [0, 0], Orientation.Horizontal);

    player.switchShipOrientation(ship);

    expect(ship.orientation).toEqual(Orientation.Vertical);

    player.switchShipOrientation(ship);

    expect(ship.orientation).toEqual(Orientation.Horizontal);
  });

  it("switchShipOrientation should not change orientation if smart move is false", () => {
    const ship = new Ship(Name.Carrier, [0, 0], Orientation.Vertical);

    player.moveToClosestValidPosition = jest.fn(() => false);

    player.switchShipOrientation(ship);

    expect(ship.orientation).toEqual(Orientation.Vertical);
  });

  it("findShipByCoord should find a ship by coordinates", () => {
    const carrier = new Ship(Name.Carrier, [0, 0], Orientation.Horizontal);
    player.placeShip(carrier);
    player.syncShipsToBoard();

    const foundShip = player.findShipByCoord([0, 0]);

    expect(foundShip).toEqual(carrier);
  });

  it("createAttack should create an attack and update board and ships", () => {
    const ship = new Ship(Name.Carrier, [0, 0], Orientation.Horizontal);
    player.ships.push(ship);
    player.syncShipsToBoard();

    player.createAttack([0, 0]); // Needs the data in board

    expect(player.board[0].hit).toBe(true);
    expect(ship.hits).toBe(1);
  });

  it("should sync ships to the board correctly", () => {
    const carrier = new Ship(Name.Carrier, [0, 0], Orientation.Vertical);
    player.placeShip(carrier);
    player.syncShipsToBoard();

    player.createAttack([0, 0]);

    player.syncShipsToBoard();

    expect(player.board[0]).toEqual({ ship: Name.Carrier, hit: true });
    expect(player.board[10]).toEqual({ ship: Name.Carrier, hit: false });
    expect(player.board[20]).toEqual({ ship: Name.Carrier, hit: false });
    expect(player.board[30]).toEqual({ ship: Name.Carrier, hit: false });
    expect(player.board[40]).toEqual({ ship: Name.Carrier, hit: false });
  });
});
