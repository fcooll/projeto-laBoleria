import express from "express";
import { postClients, getClientsOrders } from "../controllers/clientsController.js";

const clientRouter = express.Router();

clientRouter.post('/clients',  postClients);
clientRouter.get('/clients/:id/orders', getClientsOrders);

export default clientRouter;