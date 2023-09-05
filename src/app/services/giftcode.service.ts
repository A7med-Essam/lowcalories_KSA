import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { IGiftCodeData, IGiftCodeResponse } from '../interfaces/giftcode.interface';

@Injectable({
  providedIn: 'root',
})
export class GiftcodeService {
  constructor(private _ApiService: ApiService) {}
  applyGiftCode(subscription:IGiftCodeData): Observable<{status:number,data:IGiftCodeResponse, message:string}>{
    return this._ApiService.postReqV3('giftCodeV4', subscription);
  }
}
