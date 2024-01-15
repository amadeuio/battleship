import { Name, Orientation, Ship } from "../modules/ship";
import { Player, Role } from "../modules/player";

//it("should return true for a valid ship placement", () => {
// Arrange
const playerInstance = new Player(Role.Player);
const destroyer = new Ship(Name.Destroyer, [5, 5], Orientation.Horizontal); // length 2
const carrier = new Ship(Name.Carrier, [3, 3], Orientation.Vertical); // length 5
playerInstance.placeShip(destroyer);
playerInstance.placeShip(carrier);

console.log(playerInstance.ships);
console.log(playerInstance.isValidPlacement(carrier));

// Act
//const result = playerInstance.isValidPlacement(carrier);

// Assert
//expect(result).toBe(!true);
//});
