  export interface IEmirateAppointmentsResponse {
    id:           number;
    en_name:      string;
    ar_name:      string;
    inbody_price: string;
    appointments: IAppointment[];
  }
  
  export interface IAppointment {
    id:         number;
    type:       string;
    emara_id:   number;
    day:        string;
    date:       string;
    max_people: number;
    times:      ITime[];
  }
  
  export interface ITime {
    id:                     number;
    emirate_appointment_id: number;
    time_from:              string;
    time_to:                string;
    booked:                 number;
  }

export interface IClinicStep1Form{
  first_name:string
  email:string
  whatsApp:string
  address:string
  phone_number:number
  emirate_id:number
}

export interface IClinicCheckout{
  first_name:string
  email:string
  whatsApp:string
  address:string
  phone_number:number
  emirate_id:number
  max_people:number
  time_id:number
  date:string
  day:string
}