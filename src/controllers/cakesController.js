import { insertCake, existCake } from "../repositories/cakesRepository.js";
import cakesSchema from "../schemas/cakesSchema.js";

async function postCake(req, res){
    const { name, price, image, description } = req.body;

    const validCake = cakesSchema.validate({ name, price, image, description })

    if (validCake.error) {
      if (validCake.error.message == '"image" is not allowed to be empty' || validCake.error.message == '"image" must be a valid uri') {
        return res.send(422);
      }
  
      return res.send(400);
    }
  
    try {
      const findCakeName = await existCake(name);
  
      if (findCakeName.rows.length > 0) {
        return res.send(409);
      }
  
      await insertCake(name, price, description, image);
      return res.send(201);
    } catch (error) {
      return res.send(500);
    }
}

export { postCake };