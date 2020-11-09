import Appointment from '../entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getRepository, Repository } from 'typeorm';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

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
  public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appoinment = this.ormRepository.create({ provider_id, date });
    await this.ormRepository.save(appoinment);

    return appoinment;
  }

}

export default AppointmentsRepository;
