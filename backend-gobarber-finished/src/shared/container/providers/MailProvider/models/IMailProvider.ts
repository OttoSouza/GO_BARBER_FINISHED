import ISendMailDTO from '../dtos/ISendMailDTO';

export default interface IMailProvider {
  sendMail(daata: ISendMailDTO): Promise<void>;
}
