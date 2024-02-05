import * as bcrypt from 'bcrypt';
import getConfigVariables from '../config/configVariables.config';
import { envConstants } from '../config/constant';

/**
 * Encrypts a plain text password.
 *
 * @param {string} plainTextPassword The password to encrypt.
 *
 * @return {Promise<string>} The encrypted password.
 */
export async function encryptPassword(
  plainTextPassword: string,
): Promise<string> {
  // Get the password salt from the environment variables
  const PASSWORD_SALT = parseInt(
    await getConfigVariables(envConstants.jwt.bcryptSalt),
  );
  // Hash the password with the salt
  return bcrypt.hash(plainTextPassword, PASSWORD_SALT);
}

/**
 * Compares a plain text password with a hashed password.
 *
 * @param {string} plainTextPassword The plain text password.
 * @param {string} hashedPassword The hashed password.
 *
 * @return {Promise<boolean>} True if the passwords match, false otherwise.
 */
export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  // Compare the plain text password with the hashed password
  return bcrypt.compare(plainTextPassword, hashedPassword);
}
