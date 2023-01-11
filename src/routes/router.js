import express from "express";
import cakeRouter from "./cakesRouter.js";
import clientRouter from "./clientsRouter.js";
import orderRouter from "./ordersRouter.js";

const router = express.Router();

router.use(cakeRouter);
router.use(clientRouter);
router.use(orderRouter);

export default router;