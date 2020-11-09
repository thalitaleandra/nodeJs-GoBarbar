import User from '../infra/typeorm/entities/User'
import { sign } from 'jsonwebtoken'
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import AppError from '@shared/erros/AppError';

interface IRequest {
  email: string,
  password: string
}
interface IResponse {
  user: User,
  token: string
}
@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) { }
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401)
    }
    const passwordMatched = await this.hashProvider.compareHash(
      password, user.password);
    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401)
    }
    //const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, 'aa2481f29d92155e8ffdb63a9f8ff9fa', {
      subject: user.id,
      expiresIn: '2d'
    });
    return {
      user,
      token
    }
  }
}
