import joi from 'joi'

const clientsSchema = joi.object({
  name: joi.string().required(),
  address: joi.string().required(),
  phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required()
});

export default clientsSchema;