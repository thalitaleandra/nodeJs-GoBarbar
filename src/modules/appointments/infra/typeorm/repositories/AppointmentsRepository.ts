import Appointment from '../entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getRepository, Repository, Raw } from 'typeorm';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindlAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllnMonthFromProviderDTO'
import IFindAllinDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>
  constructor() {
    this.ormRepository = getRepository(Appointment);
  }
  public async findByDate(date: Date): Promise<Appointment | undefined> {

    const findAppointment = await this.ormRepository.findOne({
      where: { date }
    })

    return findAppointment;
  }
  public async findAllInMonthFromProvider({ provider_id, year, month }: IFindlAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month);

    const appoinments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY)= '${parsedMonth}-${year}'`,
        )
      }
    })

    return appoinments;
  }
  public async findAllInDayFromProvider({ provider_id, day, year, month }: IFindAllinDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');

    const parsedMonth = String(month).padStart(2, '0');

    const appoinments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY)= '${parsedDay}-${parsedMonth}-${year}'`,
        )
      }
    })

    return appoinments;
  }

  public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appoinment = this.ormRepository.create({ provider_id, user_id, date });
    await this.ormRepository.save(appoinment);

    return appoinment;
  }

}

export default AppointmentsRepository;
