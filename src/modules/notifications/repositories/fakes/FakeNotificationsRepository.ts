import { ObjectID } from 'mongodb'

import Notifications from '../../infra/typeorm/schemas/Notification';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';


class NotificationsRepository implements INotificationsRepository {
  private notifications: Notifications[] = []

  public async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notifications> {

    const notifications = new Notifications();

    Object.assign(notifications, { id: new ObjectID(), content, recipient_id });
    this.notifications.push(notifications);

    return notifications;
  }

}

export default NotificationsRepository;
