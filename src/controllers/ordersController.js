import ordersSchema from "../schemas/ordersSchema.js";
import { existClient } from "../repositories/clientsRepository.js";
import { existCake } from "../repositories/cakesRepository.js";
import { connection } from "../db/database.js";

async function postOrder(req, res) {
    const { clientId, cakeId, quantity, totalPrice } = req.body;
  
    const validOrder = ordersSchema.validate({clientId, cakeId, quantity, totalPrice});
  
    try {
      const clientExist = await existClient(clientId);
  
      const cakeExist = await existCake(cakeId);
  
      if (clientExist.rows.length === 0) {
        return res.send(404);
      }
  
      if (cakeExist.rows.length === 0) {
        return res.send(404);
      }
  
      if (validOrder.error) {
        return res.send(400);
      }
  
      await connection.query(
        'INSERT INTO orders ("clientId", "cakeId", quantity, "totalPrice") VALUES ($1, $2, $3, $4);',
        [clientId, cakeId, quantity, totalPrice]);
  
      return res.send(201);
    } catch (error) {
      return res.send(500);
    }
}

function validDate(dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2}$/
  
    if (dateStr.match(regex) === null) {
      return false;
    }
  
    const date = new Date(dateStr);
  
    const timestamp = date.getTime();
  
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
      return false;
    }
  
    return date.toISOString().startsWith(dateStr);
}
  
async function ordersQuery(filter) {
    const query = `
      SELECT 
        clients.id AS "clients.id",
        clients.name AS "clients.name",
        clients.address AS "clients.address",
        clients.phone AS "clients.phone",
        cakes.id AS "cakes.id",
        cakes."name" AS "cakes.name",
        cakes.price AS "cakes.price",
        cakes.image AS "cakes.image",
        cakes.description AS "cakes.description",
        orders.id AS "orders.id",
        to_char(orders."createdAt", 'YYYY-MM-DD HH24:MI') AS "orders.createdAt",
        orders.quantity AS "orders.quantity",
        orders."totalPrice" AS "orders.totalPrice"
      FROM orders 
      JOIN clients ON orders."clientId" = clients.id 
      JOIN cakes ON orders."cakeId" = cakes.id`;
  
    if (Object.keys(filter).length === 0) {
      return connection.query(`${query};`);
    }
  
    if (validDate(filter['date'])) {
      return connection.query(
        `${query} WHERE orders."createdAt" BETWEEN '${filter['date']} 00:00:00' AND '${filter['date']} 23:59:59';`);
    }
  
    return null;
}
  
async function getAllOrders(req, res) {
    const filter = req.query;
  
    try {
      const query = await ordersQuery(filter);
  
      if (!query) {
        return res.send(400);
      }
  
      if (query.rows.length === 0) {
        return res.status(404).send([]);
      }
  
      const result = query?.rows.map(query => ({
        client: {
          id: query['clients.id'],
          name: query['clients.name'],
          address: query['clients.address'],
          phone: query['clients.phone']
        },
        cake: {
          id: query['cakes.id'],
          name: query['cakes.name'],
          price: query['cakes.price'],
          description: query['cakes.description'],
          image: query['cakes.image']
        },
        orderId: query['orders.id'],
        createdAt: query['orders.createdAt'],
        quantity: query['orders.quantity'],
        totalPrice: query['orders.totalPrice']
      }));
      return res.status(200).send(result);
    } catch {
      return res.send(500);
    }
}
  
async function getOrdersById(req, res) {
    const orderId = req.params;
  
    try {
      const query = await connection.query(
        `SELECT 
        clients.id AS "clients.id",
         clients.name AS "clients.name",
         clients.address AS "clients.address",
         clients.phone AS "clients.phone",
         cakes.id AS "cakes.id",
         cakes."name" AS "cakes.name",
         cakes.price AS "cakes.price",
         cakes.image AS "cakes.image",
         cakes.description AS "cakes.description",
         orders.id AS "orders.id",
         to_char(orders."createdAt", 'YYYY-MM-DD HH24:MI') AS "orders.createdAt",
         orders.quantity AS "orders.quantity",
         orders."totalPrice" AS "orders.totalPrice"
         FROM orders 
        JOIN clients ON orders."clientId" = clients.id 
        JOIN cakes ON orders."cakeId" = cakes.id
        WHERE orders.id = $1;`,
        [orderId.id]);
  
      if (query.rows.length === 0) {
        return res.send(404);
      }
  
      const result = query?.rows.map(query => ({
        client: {
          id: query['clients.id'],
          name: query['clients.name'],
          address: query['clients.address'],
          phone: query['clients.phone']
        },
        cake: {
          id: query['cakes.id'],
          name: query['cakes.name'],
          price: query['cakes.price'],
          description: query['cakes.description'],
          image: query['cakes.image']
        },
        orderId: query['orders.id'],
        createdAt: query['orders.createdAt'],
        quantity: query['orders.quantity'],
        totalPrice: query['orders.totalPrice']
      }));
  
      return res.status(200).send(result);
    } catch {
      return res.send(500);
    }
}

export { postOrder, getAllOrders, getOrdersById };