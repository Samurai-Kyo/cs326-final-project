const validPlacements = [];

const place = (wordArr, x, y, placement) => {
  if (wordArr.length === 0) {
    validPlacements.push({ ...placement });
    return;
  }

  // check outside bounds
  if (x < 0 || x >= this.board.length || y < 0 || y >= this.board[0].length) {
    return;
  }

  // check if letter can be placed, try all directions
  const letter = wordArr[0];
  const letterCount = (placement[letter] && placement[letter].length) || 0;

  if (
    (this.board[x][y] === null || this.board[x][y] === letter) &&
    (!placement[letter] || letterCount < 2)
  ) {
    // Update placement object
    const updatedPlacement = { ...placement };
    if (!updatedPlacement[letter]) {
      updatedPlacement[letter] = [];
    }
    updatedPlacement[letter].push({ x, y });

    // Explore all directions with the updated placement
    place(wordArr.slice(1), x + 1, y, updatedPlacement);
    place(wordArr.slice(1), x - 1, y, updatedPlacement);
    place(wordArr.slice(1), x, y + 1, updatedPlacement);
    place(wordArr.slice(1), x, y - 1, updatedPlacement);
  }

  return;
};

const word = "TEST";
const x = 0;
const y = 0;
place([...word], x, y, {});

console.log(validPlacements);
