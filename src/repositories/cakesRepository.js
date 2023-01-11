import { connection } from "../db/database.js";

async function insertCake(name, price, image, description) {
    return connection.query(
      `INSERT INTO cakes (name, price, image, description) VALUES ($1, $2, $3, $4)`, [name, price, image, description]
    );
}

async function existCake(name){
    return connection.query('SELECT name FROM cakes WHERE name = $1', [name]);
}

export { insertCake, existCake };