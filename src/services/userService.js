import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { isSignUpDataValid } from '../validation/signUp.js';

import * as userRepository from '../repositories/userRepository.js';
import * as sessionRepository from '../repositories/sessionRepository.js';

async function getSignInInfos({ email, password }) {
  const user = await userRepository.getUserInfosByEmail(email);
  if (!user) {
    return null;
  }
  if (!bcrypt.compareSync(password, user.password)) return false;

  const previousSession = await sessionRepository.getUserSession(user.id);

  const newToken = uuid();
  if (previousSession) {
    const session = await sessionRepository.updateSession({ newToken, userId: user.id });
    if (!session) return undefined;
  } else {
    const session = await sessionRepository.createSession({ newToken, userId: user.id });
    if (!session) return undefined;
  }
  return { user, newToken };
}

async function verifySignUpInfos({
  name,
  cpf,
  password,
  email,
  repeatEmail,
  repeatPassword,
}) {
  if (!isSignUpDataValid({ name, cpf, password, email, repeatEmail, repeatPassword })) {
    return null;
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const verifyIfUserExist = await userRepository.getUsersByCpfOrEmail({ cpf, email });
  if (verifyIfUserExist.length > 0) {
    return false;
  }
  const createAccount = await userRepository.createNewAccount({
    name,
    cpf,
    password: passwordHash,
    email,
  });
  if (!createAccount) return undefined;
  return createAccount;
}
export { getSignInInfos, verifySignUpInfos };
