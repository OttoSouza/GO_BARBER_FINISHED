import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationsDTO from '../dtos/INotificationsDTO';

export default interface INotificationsRepository {
  create(data: INotificationsDTO): Promise<Notification>;
}
