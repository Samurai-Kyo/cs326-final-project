/**
 * Removes underscores and capitalizes the first letter of each word.
 * @param {string} word The word to prettify.
 * @returns The prettified word.
 */
function prettifyWord(word) {
  return word.replace(/(^\w{1})|(\_\w{1})/g, (match) =>
    match.toUpperCase().replace("_", " ")
  );
}

export { prettifyWord };
