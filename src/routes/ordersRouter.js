import express from "express";
import { postOrder, getAllOrders, getOrdersById } from "../controllers/ordersController.js";

const orderRouter = express.Router();

orderRouter.post('/order', postOrder);
orderRouter.get('/order', getAllOrders);
orderRouter.get('/order/:id', getOrdersById);

export default orderRouter;