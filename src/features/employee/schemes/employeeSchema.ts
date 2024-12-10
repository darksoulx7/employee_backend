import Joi, { ObjectSchema } from 'joi';

const employeeSchema: ObjectSchema = Joi.object({
  department_id: Joi.number().required(),
  name: Joi.string().required(),
  dob: Joi.date().required(),
  phone: Joi.string().required(),
  photo: Joi.string().optional().allow(''),
  email: Joi.string().email().required(),
  salary: Joi.number().required(),
  status: Joi.boolean().optional(),
});

export { employeeSchema };
