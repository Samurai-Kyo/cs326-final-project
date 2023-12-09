import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { readFile, writeFile } from "fs/promises";

// Sets up path to .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

class DB {
  constructor() {
    const USER = process.env.DB_USER;
    const PASSWORD = process.env.DB_PASSWORD;
    const SERVER = process.env.DB_SERVER;
    this.JSONPATH = path.join(__dirname, process.env.JSON_PATH);
    this.client = new pg.Client(
      `postgres://${USER}:${PASSWORD}@${SERVER}/${USER}`
    );
  }

  /**
   * Connects to the database.
   */
  async connect() {
    try {
      await this.client.connect();
      console.log("Connected to database");
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Closes the connection to the database.
   */
  async close() {
    try {
      await this.client.end();
      console.log("Closed connection to database");
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Closes the connection to the database.
   */
  async disconnect() {
    await this.client.end();
  }

  /**
   * Initializes the database. Drops all tables and creates new ones.
   */
  async setup() {
    try {
      await this.client.query(`
            DROP TABLE IF EXISTS categories CASCADE;
            DROP TABLE IF EXISTS words CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
            DROP TABLE IF EXISTS scores CASCADE;
            DROP TABLE IF EXISTS scoreboard CASCADE;
            `);
      await this.client.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
      CREATE TABLE words (
          id SERIAL PRIMARY KEY,
          word VARCHAR(255) NOT NULL,
          category_id INTEGER REFERENCES categories(id)
      );
      CREATE TABLE scoreboard (
          id SERIAL PRIMARY KEY,
          score INTEGER NOT NULL DEFAULT 0,
          name VARCHAR(255) NOT NULL,
          category_id INTEGER REFERENCES categories(id),
          board_size INTEGER NOT NULL DEFAULT 5
      );
      `);
      console.log("Database initialized");
      await this.populate();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Populates the database with data from JSON file set in env.
   */
  async populate() {
    try {
      const categories = await this.fixWordsJSON();
      //   console.log(categories);
      for (const category in categories) {
        console.log(`Adding ${category}...`);
        const result = await this.client.query(
          `
                INSERT INTO categories (name)
                VALUES ($1)
                RETURNING *;
                `,
          [category]
        );
        const category_id = result.rows[0].id;
        for (const word of categories[category]) {
          console.log(`Adding ${word}...`);
          await this.client.query(
            `
                    INSERT INTO words (word, category_id)
                    VALUES ($1, $2)
                    RETURNING *;
                    `,
            [word, category_id]
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Removes duplicate words and special characters
   * from JSON file set in env.
   * Writes new JSON file with unique words.
   */
  async fixWordsJSON() {
    try {
      const data = await readFile(this.JSONPATH, "utf-8");
      const categoriesJSON = JSON.parse(data);
      for (const category in categoriesJSON) {
        const words = categoriesJSON[category];
        const uniqueWords = [...new Set(words)].map((word) =>
          word.replace(/\(.*\)/g, "").replace(/[^a-zA-Z]/g, "")
        );
        categoriesJSON[category] = uniqueWords;
      }
      await writeFile(this.JSONPATH, JSON.stringify(categoriesJSON));
      return categoriesJSON;
    } catch (error) {
      console.log(`Error reading JSON file in: ${this.JSONPATH}`);
      console.log(error);
    }
  }

  /**
   * Queries the database with the given query string and values.
   * @param {String} queryString
   * @param {[String]} values
   * @returns
   */
  async query(queryString, values) {
    try {
      const result = await this.client.query(queryString, values);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Gets all categories from the database.
   * @returns An array with all categories in the database.
   */
  async getCategories() {
    try {
      const result = await this.client.query(`
            SELECT * FROM categories;
            `);
      return result.rows.map((row) => row.name);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Gets words from the database by category.
   * @param {int} category_id
   * @returns An array with all words in the given category.
   */
  async getWordsByCategory(category_id) {
    try {
      const result = await this.client.query(
        `
            SELECT * FROM words
            WHERE category_id = $1;
            `,
        [category_id]
      );
      return result.rows.map((row) => row.word);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Gets all words from the database.
   * @returns An array with all words in the database.
   */
  async getWords() {
    try {
      const result = await this.client.query(`
            SELECT * FROM words;
            `);
      return result.rows.map((row) => row.word);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Gets all words from the database.
   * @returns An object with all scores, along with its user and category in the database.
   */
  async getScores() {
    // FIXME: This query is not working
  }

  /**
   * Adds a category to the database.
   * @param {String} name
   * @returns An object with category that was added and its id.
   */
  async addCategory(name) {
    try {
      const result = await this.client.query(
        `
            INSERT INTO categories (name)
            VALUES ($1)
            RETURNING *;
            `,
        [name]
      );
      return { name: result.rows[0].name, id: result.rows[0].id };
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Adds a word to the database.
   * @param {String} word
   * @param {int} category_id
   * @returns An object of the word that was added with id and category_id.
   */
  async addWord(word, category_id) {
    try {
      const result = await this.client.query(
        `
            INSERT INTO words (word, category_id)
            VALUES ($1, $2)
            RETURNING *;
            `,
        [word, category_id]
      );
      return {
        word: result.rows[0].word,
        id: result.rows[0].id,
        category_id: result.rows[0].category_id,
      };
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Adds multiple words to the database.
   * @param {[string]} words
   * @param {int} category_id
   */
  async addWords(words, category_id) {
    try {
      for (const word of words) {
        await this.addWord(word, category_id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Adds a score to the database.
   * @param {string} name The username of the user.
   * @param {int} score The score of the user.
   * @param {int} category_id The category id of the game.
   */
  async addScore(name, score, category_id, board_size) {
    try {
      const result = await this.client.query(
        `
            INSERT INTO scoreboard (name, score, category_id, board_size)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `,
        [name, score, category_id, board_size]
      );
      return result.rows[0];
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Gets a user's score from the database.
   * @param {int} user_id
   * @returns An array of the user's scores.
   */
  async getScoreByUser(user_id) {
    // FIXME: This query is not working 
  }
}

export default DB;
