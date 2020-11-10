import User from "../infra/typeorm/entities/User";
//import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import AppError from "@shared/erros/AppError";
//import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
//import AppError from '@shared/erros/AppError';
//import path from 'path'
interface IRequest {
  user_id: string;
}
@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }
  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found');
    }

    return user;


  }
}
