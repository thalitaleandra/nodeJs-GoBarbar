//import User from "../infra/typeorm/entities/User";
import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/erros/AppError';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
interface IRequest {
  email: string
}
@injectable()
export default class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

  ) { }
  public async execute({ email }: IRequest): Promise<void> {
    const checkUserExists = await this.usersRepository.findByEmail(email);
    if (!checkUserExists) {
      throw new AppError('User does not exists');
    }

    const { token } = await this.userTokensRepository.generate(checkUserExists.id)


    await this.mailProvider.sendMail(
      email,
      `Pedido de recuperacao de senha recebido ${token}`,
    );
  }
}
