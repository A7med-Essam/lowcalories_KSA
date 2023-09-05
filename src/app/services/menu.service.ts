import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { IMenuResponse } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private _ApiService: ApiService) {}

  getMenu(): Observable<{status:number,data:IMenuResponse[], message:string}> {
    return this._ApiService.postReq('menu', '');
  }
}
