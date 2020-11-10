import "reflect-metadata"
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from "@shared/erros/AppError";
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import { userInfo } from "os";
import UpdateProfile from "./UpdateProfileService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  })
  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'tata',
      email: 'tata@gmail.com',
      password: '123456'
    })
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Tata 2',
      email: 'tata@example.com',
    })
    expect(updatedUser.name).toBe('Tata 2');
    expect(updatedUser.email).toBe('tata@example.com')
  });
  it('should not be able to update the profile from non-existing user', async () => {
    expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Test',
        email: 'test@example.com'
      })).rejects.toBeInstanceOf(AppError);

  });
  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'tata',
      email: 'tata@example.com',
      password: '123456'
    })
    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@example.com',
      password: '123456',
    })
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'tata',
        email: 'tata@example.com'
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'tata',
      email: 'tata@gmail.com',
      password: '123456'
    })
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Tata 2',
      email: 'tata@example.com',
      old_password: '123456',
      password: '123123',
    })
    expect(updatedUser.password).toBe('123123');
  });
  it('should be able to not update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'tata',
      email: 'tata@gmail.com',
      password: '123456'
    })
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Tata 2',
        email: 'tata@example.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to not update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'tata',
      email: 'tata@gmail.com',
      password: '123456'
    })
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Tata 2',
        email: 'tata@example.com',
        old_password: 'wrong-old-password',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});


