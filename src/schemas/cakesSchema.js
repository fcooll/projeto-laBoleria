import joi from 'joi';

const cakeSchema = joi.object({
  name: joi.string().required().min(2),
  price: joi.number().positive().required(),
  image: joi.string().uri().required(),
  description: joi.string().allow("")
});

export default cakeSchema;