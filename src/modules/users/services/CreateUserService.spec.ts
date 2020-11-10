import "reflect-metadata"

import AppError from "@shared/erros/AppError";

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUsersService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';


let fakeAppointmentsRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUsersService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUsersService(
      fakeAppointmentsRepository,
      fakeHashProvider
    );
  })
  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'tata',
      email: 'tata@gmail.com',
      password: '123456'

    })
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {

    await createUser.execute({
      name: 'tata',
      email: 'tata@gmail.com',
      password: '123456'

    })
    await expect(createUser.execute({
      name: 'tata',
      email: 'tata@gmail.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError);
  })

})
