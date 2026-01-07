import bcrypt from 'bcrypt'
import { PasswordHasher } from '../../application/security/PasswordHasher.js'

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10)
  }
}
