import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import {fileURLToPath} from 'url';

// Sets up path to .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

class DB {
    constructor() {
        const USER = process.env.DB_USER;
        const PASSWORD = process.env.DB_PASSWORD;
        const SERVER = process.env.DB_SERVER;
        this.JSONPATH = process.env.JSONPATH;
        this.client = new pg.Client(`postgres://${USER}:${PASSWORD}@${SERVER}/${USER}`);
        console.log(`postgres://${USER}:${PASSWORD}@${SERVER}/${USER}`);
    }

    async connect() {
        try {
            await this.client.connect();
        } catch (error) {
            console.log(error);
        }
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
            CREATE TABLE categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
            CREATE TABLE words (
                id SERIAL PRIMARY KEY,
                word VARCHAR(255) NOT NULL,
                category_id INTEGER REFERENCES categories(id)
            );
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255)
            );
            CREATE TABLE scores (
                id SERIAL PRIMARY KEY,
                score INTEGER NOT NULL,
                user_id INTEGER REFERENCES users(id)
            );
            `);
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
            const categories = await this.removeDupesJSON();
            for (const category in categories) {
                const result = await this.client.query(`
                INSERT INTO categories (name)
                VALUES ($1)
                RETURNING *;
                `, [category]);
                const category_id = result.rows[0].id;
                for (const word of categories[category]) {
                    await this.client.query(`
                    INSERT INTO words (word, category_id)
                    VALUES ($1, $2)
                    RETURNING *;
                    `, [word, category_id]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Removes duplicate words from JSON file set in env.
     * Writes new JSON file with unique words.
     */
    async removeDupesJSON() {
        try {
            const data = await readFile(this.JSONPATH, 'utf-8');
            const categoriesJSON = JSON.parse(data);
            for (const category in categoriesJSON) {
                const words = categoriesJSON[category];
                const uniqueWords = [...new Set(words)];
                categoriesJSON[category] = uniqueWords;
            }
            await writeFile(this.JSONPATH, JSON.stringify(categoriesJSON));
        } catch (error) {
            console.log("Make sure you run this script from project root directory");
            console.log(error);
        }
    }

    /**
     * Closes the connection to the database.
     */
    async close() {
        try {
            await this.client.end();
        } catch (error) {
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
     * @returns All categories in the database.
     */
    async getCategories() {
        try {
            const result = await this.client.query(`
            SELECT * FROM categories;
            `);
            return result.rows;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Gets words from the database by category.
     * @param {int} category_id 
     * @returns All words in the given category.
     */
    async getWordsByCategory(category_id) {
        try {
            const result = await this.client.query(`
            SELECT * FROM words
            WHERE category_id = $1;
            `, [category_id]);
            return result.rows;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Gets all words from the database.
     * @returns All words in the database.
     */
    async getWords() {
        try {
            const result = await this.client.query(`
            SELECT * FROM words;
            `);
            return result.rows;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Gets all words from the database.
     * @returns All scores in the database.
     */
    async getScores() {
        try {
            const result = await this.client.query(`
            SELECT * FROM scores
            ORDER BY score DESC;
            `);
            return result.rows;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Adds a category to the database.
     * @param {String} name 
     * @returns The category that was added.
     */
    async addCategory(name) {
        try {
            const result = await this.client.query(`
            INSERT INTO categories (name)
            VALUES ($1)
            RETURNING *;
            `, [name]);
            return result.rows[0];
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Adds a word to the database.
     * @param {String} word 
     * @param {int} category_id 
     * @returns The word that was added.
     */
    async addWord(word, category_id) {
        try {
            const result = await this.client.query(`
            INSERT INTO words (word, category_id)
            VALUES ($1, $2)
            RETURNING *;
            `, [word, category_id]);
            return result.rows[0];
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
     * Adds a user to the database.
     * @param {string} username 
     * @param {string} password 
     * @returns The user that was added.
     */
    async addUser(username, password = "") {
        try {
            const result = await this.client.query(`
            INSERT INTO users (username, password)
            VALUES ($1, $2)
            RETURNING *;
            `, [username, password]);
            return result.rows[0];
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Adds a score to the database.
     * @param {int} score 
     * @param {int} user_id 
     * @returns The score that was added.
     */
    async addScore(score, user_id) {
        try {
            const result = await this.client.query(`
            INSERT INTO scores (score, user_id)
            VALUES ($1, $2)
            RETURNING *;
            `, [score, user_id]);
            return result.rows[0];
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Gets a user's score from the database. 
     * @param {int} user_id 
     * @returns The user's score.
     */
    async getScoreByUser(user_id) {
        try {
            const result = await this.client.query(`
            SELECT * FROM scores
            WHERE user_id = $1;
            `, [user_id]);
            return result.rows;
        } catch (error) {
            console.log(error);
        }
    }
}

export const db = new DB();