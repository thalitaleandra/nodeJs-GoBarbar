import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import AppError from '@shared/erros/AppError';
interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {

  }

  public async execute({ provider_id, user_id, date }: IRequest): Promise<Appointment> {
    // const appointmentsRepository = getCustomRepository(AppointmentsRepository)
    const appoinmentDate = startOfHour(date);

    if (isBefore(appoinmentDate, Date.now())) {
      throw new AppError('You cant create an appointment on a past date')
    }
    if (user_id === provider_id) {
      throw new AppError('You cant create an appointment with yourself')
    }

    if (getHours(appoinmentDate) < 8 || getHours(appoinmentDate) > 17) {
      throw new AppError('You can only create appointments between 8am and 5pm')
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appoinmentDate,
    );
    if (findAppointmentInSameDate) {
      throw new AppError('this appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appoinmentDate,
    });
    const dateFormatted = format(appoinmentDate, "dd/MM/yyyy 'às' HH:mm'h'")

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`
    })
    return appointment;
  }
}

export default CreateAppointmentService;
