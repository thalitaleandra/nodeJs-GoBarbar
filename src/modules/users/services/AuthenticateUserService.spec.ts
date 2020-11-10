import "reflect-metadata"
import AppError from "@shared/erros/AppError";


import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUsersService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';




let fakeAppointmentsRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUsersService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(
      fakeAppointmentsRepository,
      fakeHashProvider
    );
    authenticateUser = new AuthenticateUsersService(
      fakeAppointmentsRepository,
      fakeHashProvider
    );

  })
  it('should be able to authenticate', async () => {

    const user = await createUser.execute({
      name: 'tata',
      email: 'tata@gmail.com',
      password: '123456'
    });
    const response = await authenticateUser.execute({
      email: 'tata@gmail.com',
      password: '123456'

    })
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
  it('should not be able to authenticate with non existing user', async () => {


    await expect(authenticateUser.execute({
      email: 'tata@gmail.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to authenticate with wrong password', async () => {

    await createUser.execute({
      name: 'tata',
      email: 'tata@gmail.com',
      password: '123456'
    });

    await expect(authenticateUser.execute({
      email: 'tata@gmail.com',
      password: 'wrong-password'
    })).rejects.toBeInstanceOf(AppError);
  });

})
