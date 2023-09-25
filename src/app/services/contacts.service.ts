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

  getSocialMedia(): Observable<{
    status: number;
    message: string;
    data: socialMedia[];
  }> {
    return this._ApiService.postReq('social_media', '');
  }
}

interface IMail {
  name: string;
  email: string;
  subject: string;
  mobile: string;
  message: string;
}

export interface socialMedia {
  id: number;
  type: string;
  value: string;
  link: string;
  image: string;
  deleted_at: null;
}
