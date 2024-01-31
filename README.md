![languages](https://img.shields.io/badge/languages-ts-blue)
[![learned on](https://img.shields.io/badge/learned_on-the_odin_project-d19900)](https://www.theodinproject.com/lessons/node-path-javascript-battleship)
![license](https://img.shields.io/badge/license-MIT-green)

# Battleship ⚓

Battleship game web app. Last project of the JavaScript chapter in [The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-battleship).

## Demo

<p align="center">
  <img src="public/screenshots/screenshot1.png" width="650px" alt="screenshot">
</p>
<p align="center">
  <img src="public/screenshots/screenshot2.png" width="650px" alt="screenshot">
</p>
<h2 align="center">
  <a href="https://amadeu-io.github.io/battleship">👉 Demo</a>
</h2>

## Features

The app has been built to be very easy to use

**Ship Placements**

- Randomly shuffle ship placements
- Drag & drop for positioning
- Click to switch orientation
- If a ship is placed on an invalid position, instead of throwing an error or not doing anything, the UI cleverly places it in the closest valid position available

**Quick Start**

- Start playing in seconds with just two Enter key presses if you don't care about ship placements

**Visual UI**

- Animations and disctintive colors for the different game events ensures the user understands what's going on

## Tech Stack

- **Languages:** TypeScript, CSS, HTML
- **Build Tool:** Vite
- **Interaction Dependencies:** interact.js
- **Testing Framework:** Jest

## Directories

- `/src`: Contains the source code for the project.
  - `/src/styles`: CSS styles.
  - `/src/ts/classes`: TypeScript classes.
  - `/src/ts/main.ts`: App functionality, DOM and object manipulation.
- `/docs`: Distribution files generated during the build, GitHub pages is reading the root of this directory.

- `/public`: Images, sprites and font.

- `index.html`: Entry point for the Vite app in development with dynamic injection of TypeScript and CSS.

## Classes

The project utilizes several TypeScript classes to organize data and encapsulate functionality

### 1. `Ship` Class:

Represents each individual ship.

**Properties**

- `name`
- `length`
- `position`
- `orientation`
- `hits`
- `sunk`
- `coordinates`: Computed property

**Methods**

- `hit()`: Increments the number of hits on the ship

- `isSunk()`: Returns a boolean indicating whether the ship is sunk

- `get coordinates()`: Getter method that computes an array of coordinates based on lenght, position and orientation

- `clone()`: Creates a duplicate instance of the `Ship` class with the same properties

### 2. `Player` Class:

Represents each player (player and opponent).

**Properties**

- `role`: Role of the player.
- `board`: Array of `{ ship: null, hit: false }` objects representing each cell of the player's game board.
- `ships`: Array of `Ship`s.
- `death`: Boolean flag indicating whether the player has been defeated.

**Main Methods**

- `placeShip(ship)`: Adds a ship on `ships`.

- `moveShip(ship, newPosition)`: Changes the position of a ship in `ships` if valid.

- `switchShipOrientation(ship)`: Switches the orientation of a ship if `ships` if valid, if not, it places the ship in a close valid position.

- `syncShipsToBoard()`: Updates the `board` with the data in `ships`.

- `createAttack(position)`: Adds the attack on both `ships` and `board`.

- `async createDelayedRandomUnrepAttack()`: Creates a delayed random unrepeated attack used by the computer. The delay improves the UX by giving the impression the computer is 'thinking'.

- `moveToClosestValidPosition(ship, desiredPosition)`: It's `moveShip` on steroids. If the desired position is not valid, it starts exporing close positions and places the ship as soon as it finds one. It also returns a boolean indicating if the placement was sucessful, used in other methods to make sure the position is never updated if the return is `false`, as it could result in an invalid placement.

- `populateRandomly()`: Randomly populates the player's `ships` with only valid placements.

- `isInvalidPlacement(candidateShip)`: Checks if a ship is in an invalid position (i.e. overlaps with other ships or goes out of bounds). This method is crucial for the correct functioning of `moveToClosestValidPosition` and `populateRandomly`.

### 3. `playerRenderer` Class:

Serves as a bridge between `player` and the UI.

**Properties**

- `player`
- `htmlBoard`
- `htmlCells`
- `htmlShips`
- `cellSize`

**Main Methods**

- `createBoard()`: Creates 100 `htmlCells` appended to the `htmlBoard`.

- `renderAttacks()`: Renders the state of `player.board` on `htmlBoard`, using the right tile for each cell based on it's hit status.

- `renderAttackAnimation(position)`: Renders an attack animation at the specified position by appending a sprite to the corresponding HTML cell.

- `renderShip(ship)`: Renders a `ship` on the board by using an HTML ship image.

- `addInteract(htmlShip)`: Adds drag-and-drop and click interaction to a specified HTML ship element using the `interact.js` library. It reads and updates the result of the interaction in `player`, ensuring it's always in sync with the UI.

- `removeInteractToAll()`: Removes interaction from all HTML ship elements on the board. Crucial for when the game starts.

- `setCellSize()`: Sets and returns the cell size based on the window width for responsive design.

## Run Locally

Clone the project

```bash
  git clone https://github.com/amadeu-io/battleship
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```
