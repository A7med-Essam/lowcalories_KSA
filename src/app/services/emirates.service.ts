import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { IEmirateResponse } from '../interfaces/emirate.interface';

@Injectable({
  providedIn: 'root'
})
export class EmiratesService {

  constructor(private _ApiService: ApiService) {}

  getEmirates(type:string): Observable<{data:IEmirateResponse[],status:number,message:string}> {
    return this._ApiService.postReq('getEmirates',{type});
  }
}
