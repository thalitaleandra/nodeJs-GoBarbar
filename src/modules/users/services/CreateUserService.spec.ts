import "reflect-metadata"
import CreateUsersService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from "@shared/erros/AppError";
describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeAppointmentsRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUsersService(
      fakeAppointmentsRepository,
      fakeHashProvider
    );
    const user = await createUser.execute({
      name: 'tata',
      email: 'tata@gmail.com',
      password: '123456'

    })
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakeAppointmentsRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUsersService(
      fakeAppointmentsRepository,
      fakeHashProvider
    );
    await createUser.execute({
      name: 'tata',
      email: 'tata@gmail.com',
      password: '123456'

    })
    expect(createUser.execute({
      name: 'tata',
      email: 'tata@gmail.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError);
  })

})
