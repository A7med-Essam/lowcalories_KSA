import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { IAddressResponse } from '../interfaces/address.interface';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private _ApiService: ApiService) {}

  getAddress(): Observable<{
    data: IAddressResponse[];
    status: number;
    message: string;
  }> {
    return this._ApiService.postReq('myAddresses', '');
  }
}
