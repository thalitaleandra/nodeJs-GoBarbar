import { getRepository, getMongoRepository, MongoRepository } from 'typeorm';

import Notifications from '../schemas/Notification';
import INotificationsRepository from '../../../repositories/INotificationsRepository';
import ICreateNotificationDTO from '../../../dtos/ICreateNotificationDTO';


class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notifications>
  constructor() {
    this.ormRepository = getMongoRepository(Notifications, 'mongo');
  }


  public async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notifications> {
    const notifications = this.ormRepository.create({ content, recipient_id });
    await this.ormRepository.save(notifications);

    return notifications;
  }

}

export default NotificationsRepository;
