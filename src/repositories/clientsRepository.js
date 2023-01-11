import { connection } from "../db/database.js";

async function insertClient(name, address, phone){
    return connection.query('INSERT INTO clients (name, address, phone) VALUES ($1, $2, $3);', [name, address, phone]);
}

async function existClient(clientId){
    return connection.query('SELECT id FROM clients WHERE id = $1', [clientId]);
}

async function getClientOrders(clientId){
    return connection.query(`SELECT orders.id AS "orderId", orders.quantity AS quantity, to_char(orders."createdAt", 'YYYY-MM-DD HH24:MI') AS "createdAt", orders."totalPrice" AS "totalPrice", cakes.name AS "cakeName" FROM orders JOIN cakes ON orders."cakeId" = cakes.id WHERE orders."clientId" = $1`, [clientId]);
}

export { insertClient, existClient, getClientOrders };