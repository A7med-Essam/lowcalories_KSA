import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { IDislikeResponse } from '../interfaces/dislike.interface';

@Injectable({
  providedIn: 'root'
})

export class DislikeService {
  constructor(
    private _ApiService:ApiService
  ) { }

  getDislikeMeals():Observable<{data:IDislikeResponse[],status:number,message:string}> {
    return this._ApiService.postReq('dislikeMeals','');
  }

}
