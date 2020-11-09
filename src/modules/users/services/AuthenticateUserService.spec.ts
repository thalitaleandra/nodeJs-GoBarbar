import "reflect-metadata"
import AuthenticateUsersService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AppError from "@shared/erros/AppError";
describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeAppointmentsRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeAppointmentsRepository,
      fakeHashProvider
    );
    const authenticateUser = new AuthenticateUsersService(
      fakeAppointmentsRepository,
      fakeHashProvider
    );
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
    const fakeAppointmentsRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUsersService(
      fakeAppointmentsRepository,
      fakeHashProvider
    );

    expect(authenticateUser.execute({
      email: 'tata@gmail.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to authenticate with wrong password', async () => {
    const fakeAppointmentsRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeAppointmentsRepository,
      fakeHashProvider
    );
    const authenticateUser = new AuthenticateUsersService(
      fakeAppointmentsRepository,
      fakeHashProvider
    );
    const user = await createUser.execute({
      name: 'tata',
      email: 'tata@gmail.com',
      password: '123456'
    });

    expect(authenticateUser.execute({
      email: 'tata@gmail.com',
      password: 'wrong-password'
    })).rejects.toBeInstanceOf(AppError);
  });

})
