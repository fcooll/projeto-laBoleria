import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/router.js';

dotenv.config();
const server = express();

server.use(cors());
server.use(express.json());

server.use(router);
server.get('/status', (req, res) => {
    res.send(`It's alive!`).status(200);
});

server.listen(process.env.PORT, () => {
    console.log(`Server Running on Port ${process.env.PORT}`);
});