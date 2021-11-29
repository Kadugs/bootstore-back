/* eslint-disable newline-per-chained-call */
import joi from 'joi';

function isSignUpDataValid(object) {
  const signUpSchema = joi
    .object({
      name: joi.string().trim().min(3).max(50).required(),
      cpf: joi.string().alphanum().length(11).required(),
      email: joi.string().trim().email().max(50).required(),
      repeatEmail: joi.ref('email'),
      password: joi.string().alphanum().min(5).max(16).required(),
      repeatPassword: joi.ref('password'),
    })
    .with('password', 'repeatPassword')
    .with('email', 'repeatEmail');

  const { error } = signUpSchema.validate(object);

  return !joi.isError(error);
}

export { isSignUpDataValid };
