import * as userService from '../services/userService.js';

async function signIn(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(400);
  try {
    const object = await userService.getSignInInfos({ email, password });
    if (object === null) return res.sendStatus(404);
    if (object === false) return res.sendStatus(401);
    if (object === undefined) return res.sendStatus(400);
    const { user, newToken } = object;
    return res.status(200).send({
      name: user.name,
      token: newToken,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

async function signUp(req, res) {
  const { name, cpf, password, email, repeatEmail, repeatPassword } = req.body;
  try {
    const newAccount = await userService.verifySignUpInfos({
      name,
      cpf,
      password,
      email,
      repeatEmail,
      repeatPassword,
    });
    if (newAccount === null) return res.sendStatus(400);
    if (newAccount === false) return res.sendStatus(409);
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

export { signIn, signUp };
