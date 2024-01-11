// Returns a random [x, y] array from 0 to 9
// TODO: Does return repeated arrays, needs refactoring

export function getRandomCoordinate(): [number, number] {
  // Create arrays with values from 0 to 9
  const xValues: number[] = Array.from({ length: 10 }, (_, index) => index);
  const yValues: number[] = Array.from({ length: 10 }, (_, index) => index);

  // Shuffle arrays to get random order
  shuffleArray(xValues);
  shuffleArray(yValues);

  // Get the first element from each shuffled array
  const x = xValues[0];
  const y = yValues[0];

  return [x, y];
}

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array: number[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
