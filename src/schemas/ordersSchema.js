import joi from 'joi';

const ordersSchema = joi.object({
  clientId: joi.number().required(),
  cakeId: joi.number().required(),
  quantity: joi.number().min(1).max(5).integer().required(),
  totalPrice: joi.number().min(1).required()
});

export default ordersSchema;