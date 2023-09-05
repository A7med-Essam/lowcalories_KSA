import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { Observable } from 'rxjs';
import { IClinicCheckout, IEmirateAppointmentsResponse } from '../interfaces/clinic.interface';

@Injectable({
  providedIn: 'root',
})
export class ClinicService {
  constructor(private _ApiService: ApiService) {}

  getEmirateAppointments(): Observable<{
    status: number;
    message: string;
    data: IEmirateAppointmentsResponse[];
  }> {
    return this._ApiService.postReq('getEmirateAppointments', '');
  }

  bookAppointmentInClinic(bookInfo: IClinicCheckout): Observable<{
    status: number;
    message: string;
    data: string;
  }> {
    return this._ApiService.postReq('bookAppointmentInClinic', bookInfo);
  }
}
