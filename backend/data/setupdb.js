import pg from 'pg';
import {readFile, writeFile} from 'fs/promises';

const URL = "postgres://kmlbrogt:l01GgmX1yghCPp5xAripqEJFLS-9Kxa2@suleiman.db.elephantsql.com/kmlbrogt";
const JSONPATH = './backend/data/categories.json';
const client = new pg.Client(URL);
const categories = await removeDupesJSON();

async function removeDupesJSON() {
    try {
        const data = await readFile(JSONPATH, 'utf-8');
        const categoriesJSON = JSON.parse(data);
        for (const category in categoriesJSON) {
            const words = categoriesJSON[category];
            const uniqueWords = [...new Set(words)];
            categoriesJSON[category] = uniqueWords;
        }
        await writeFile(JSONPATH, JSON.stringify(categoriesJSON));
        return categoriesJSON;
    } catch (error) {
        console.log("Make sure you run this script from project root directory");
        console.log(error);
    }
}


async function setupDB() {
    try {
        client.connect();
        await client.query(`
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

        for (const category in categories) {
            const result = await client.query(`
            INSERT INTO categories (name)
            VALUES ($1)
            RETURNING *;
            `, [category]);
            const category_id = result.rows[0].id;
            for (const word of categories[category]) {
                await client.query(`
                INSERT INTO words (word, category_id)
                VALUES ($1, $2)
                RETURNING *;
                `, [word, category_id]);
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        client.end();
    }
}

await setupDB();