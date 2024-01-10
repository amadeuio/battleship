import "../styles/reset.css";
import "../styles/style.css";

import { Name, Orientation, Ship } from "./modules/ship";
import { Player, Cell, Role } from "./modules/player";
import { PlayerRenderer } from "./modules/playerRenderer";

// Program starts

// Create player data

const player: Player = new Player(Role.Player);

const destroyer = new Ship(Name.Destroyer, [5, 5], Orientation.Horizontal);
const carrier = new Ship(Name.Carrier, [3, 3], Orientation.Vertical);
const battleship = new Ship(Name.Battleship, [0, 2], Orientation.Vertical);
const cruiser = new Ship(Name.Cruiser, [1, 0], Orientation.Vertical);

player.placeShip(destroyer);
player.placeShip(carrier);
player.placeShip(battleship);
player.placeShip(cruiser);

player.moveToClosestValidPosition(destroyer, [3, 5]);

/* 
player.createAttack([5, 5]);
player.createAttack([3, 3]);
player.createAttack([0, 2]);
player.createAttack([7, 9]); 
*/

// Create PlayerRenderer

const playerRenderer: PlayerRenderer = new PlayerRenderer(player);

// Render

playerRenderer.createBoard();
playerRenderer.renderShips();
playerRenderer.addDragDrop();
//playerRenderer.renderAttacks();
