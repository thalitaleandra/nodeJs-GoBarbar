import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import Appointment from '../../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindlAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllnMonthFromProviderDTO';
import IFindAllinDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];
  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment => isEqual(appointment.date, date),
    );
    return findAppointment;
  }
  public async findAllInMonthFromProvider({ provider_id, year, month }: IFindlAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment => {
        return (
          appointment.provider_id === provider_id &&
          getMonth(appointment.date) + 1 === month &&
          getYear(appointment.date) === year
        );
      })

    return appointments;
  }
  public async findAllInDayFromProvider({ provider_id, day, year, month }: IFindAllinDayFromProviderDTO): Promise<Appointment[]> {
    const appointments: any = this.appointments.filter(
      appointment => {
        return (
          appointment.provider_id === provider_id &&
          getDate(appointment.date) === day &&
          getMonth(appointment.date) + 1 === month &&
          getYear(appointment.date) === year
        );
      })

    return appointments;
  }
  public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, user_id, provider_id })
    // appointment.id = uuid();
    //appointment.date = date;
    //appointment.provider_id = provider_id;

    this.appointments.push(appointment);

    return appointment;
  }

}

export default AppointmentsRepository;
