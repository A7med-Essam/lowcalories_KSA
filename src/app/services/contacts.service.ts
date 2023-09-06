import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(private _ApiService: ApiService) {}

  sendContactMail(mail: IMail): Observable<{
    status: number;
    message: string;
    data: string;
  }> {
    return this._ApiService.postReq('contact_with_email', mail);
  }
}

interface IMail {
  name: string;
  email: string;
  subject: string;
  mobile: string;
  message: string;
}
