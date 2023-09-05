import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { IProgramResponse } from '../interfaces/program.interface';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  constructor(
    private _ApiService:ApiService
  ) { }

  getPrograms(): Observable<{ status: number; data: IProgramResponse[]; message: string }> {
    return this._ApiService.postReq('programs', '');
  }
}
