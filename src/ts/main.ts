// import "../styles/reset.css";
// import "../styles/style.css";

import { Name, Orientation, Ship } from "./modules/ship";
import { Gameboard } from "./modules/gameboard";

// Example usage
const myGameboard = new Gameboard();

// Add ships
myGameboard.placeShip(new Ship(Name.Destroyer, [4, 0], Orientation.Horizontal));
myGameboard.placeShip(new Ship(Name.Carrier, [3, 3], Orientation.Vertical));

// Create attacks
myGameboard.createAttack([4, 0]);
myGameboard.createAttack([3, 3]);

console.log(myGameboard.board[3][3]);
console.log(myGameboard.ships);
