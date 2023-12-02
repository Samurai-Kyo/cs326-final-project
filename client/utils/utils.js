export function prettifyWord(word) {
    return word.replace(/(^\w{1})|(\_\w{1})/g, (match) =>
        match.toUpperCase().replace("_", " ")
    );
}