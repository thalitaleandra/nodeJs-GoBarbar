import "reflect-metadata"
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from "@shared/erros/AppError";
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(
      fakeUsersRepository,
    );
  })
  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'tata',
      email: 'tata@example.com',
      password: '123456'
    })
    const profile = await showProfile.execute({
      user_id: user.id,
    })
    expect(profile.name).toBe('tata');
    expect(profile.email).toBe('tata@example.com')
  });
  it('should not be able to show the profile from non-existing user', async () => {
    expect(
      showProfile.execute({
        user_id: 'non-existing-user-id',
      })).rejects.toBeInstanceOf(AppError);

  });

});


