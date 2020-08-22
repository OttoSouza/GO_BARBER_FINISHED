import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppErrors from '@shared/errors/AppErrors';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeRepository;
let fakeEmailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPassword: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeRepository();
    fakeEmailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPassword = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeEmailProvider,
      fakeUserTokensRepository,
    );
  });
  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeEmailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'ottoquinho@gmail.com',
      password: '1234565',
    });

    await sendForgotPassword.execute({
      email: 'ottoquinho@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPassword.execute({
        email: 'ottoquinho@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'ottoquinho@gmail.com',
      password: '1234565',
    });

    await sendForgotPassword.execute({
      email: 'ottoquinho@gmail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
