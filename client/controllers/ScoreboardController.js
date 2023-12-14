/**
 * Fetches scores from the server
 * @returns {Promise<Array>} - Array of scores
 */
async function getScores() {
  try {
    const response = await fetch("/scoreboard");
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.log(error);
  }
}

export { getScores };
