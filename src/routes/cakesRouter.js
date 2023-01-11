import express  from "express";
import { postCake } from '../controllers/cakesController.js';

const cakeRouter = express.Router();

cakeRouter.post('/cakes',  postCake);

export default cakeRouter;