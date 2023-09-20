import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { IStateResponse } from '../interfaces/state.interface';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor(private _ApiService: ApiService) {}

  getStates(): Observable<{
    data: IStateResponse[];
    status: number;
    message: string;
  }> {
    return this._ApiService.postReq('getStates', '');
  }
}
