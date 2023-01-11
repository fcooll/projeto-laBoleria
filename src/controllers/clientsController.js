import clientsSchema from "../schemas/clientsSchema.js";
import { insertClient, existClient, getClientOrders } from "../repositories/clientsRepository.js";

async function postClients(req, res) {
    const { name, address, phone } = req.body;

    const validClient = clientsSchema.validate({ name, address, phone });

    if (validClient.error) {
        return res.send(400);
    }

    try {
        await insertClient(name, address, phone);

        return res.send(201);
    } catch (error) {
        return res.send(500);
    }
}
  
async function getClientsOrders(req, res) {
    const clientId = req.params;

    try {
        const clientExist = await existClient(clientId.id);

        const clientOrders = await getClientOrders(clientId.id);

        if (clientExist.rows.length === 0) {
            return res.send(404);
        }

        return res.status(200).send(clientOrders.rows);
    } catch {
        return res.send(500);
    }
}
  
export { postClients, getClientsOrders };