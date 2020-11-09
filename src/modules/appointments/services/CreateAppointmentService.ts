import Appointment from '../infra/typeorm/entities/Appointment';
//import { getCustomRepository } from 'typeorm'
//import AppointmentsRepository from '../infra/typeorm/repositories/AppointmentsRepository';
import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import AppError from '@shared/erros/AppError';
interface IRequest {
  provider_id: string;
  date: Date;
}
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {

  }

  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
    // const appointmentsRepository = getCustomRepository(AppointmentsRepository)
    const appoinmentDate = startOfHour(date);
    console.log(appoinmentDate)
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appoinmentDate,
    );
    if (findAppointmentInSameDate) {
      throw new AppError('this appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appoinmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
