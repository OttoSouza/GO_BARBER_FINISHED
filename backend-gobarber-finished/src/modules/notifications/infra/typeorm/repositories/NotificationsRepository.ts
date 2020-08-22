import { getMongoRepository, MongoRepository } from 'typeorm';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationsDTO from '@modules/notifications/dtos/INotificationsDTO';

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    // segundo parametro significa que ele esta usando o mongo db que esta configurado no ormconfig
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: INotificationsDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });
    await this.ormRepository.save(notification);
    return notification;
  }
}

export default NotificationsRepository;
