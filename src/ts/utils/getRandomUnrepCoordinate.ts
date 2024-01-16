// Returns a random [x, y] array from 0 to 9
// TODO: Does return repeated arrays, needs refactoring

// Generate an array with 100 tuples of all coordinates from [0, 0] to [9, 9]
const generateArray = (): [number, number][] => {
  const result: [number, number][] = [];

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      result.push([x, y]);
    }
  }

  return result;
};

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array]; // Create a copy of the original array to avoid modifying it directly

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate a random index from 0 to i

    // Swap elements at i and j
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

const originalArray = generateArray();
const shuffledArray = shuffleArray(originalArray);

// Returns a pseudo-random, unrepeated [x, y] coordinate from [0, 0] to [9, 9]
export function getRandomUnrepCoordinate(): any {
  return shuffledArray.splice(0, 1)[0]; // Return the first element of the spliced array
}
