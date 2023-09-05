import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { LocalService } from './local.service';
import { ApiService } from 'src/app/core/services/api.service';
import {
  ILoginResponse,
  IRegisterResponse,
  ISignInData,
  ISignUpData,
} from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _ApiService: ApiService) {}

  signIn(
    signInData: ISignInData
  ): Observable<{ status: number; data: ILoginResponse; message: string }> {
    return this._ApiService.postReq('login', signInData);
  }

  signUp(
    signUpData: ISignUpData
  ): Observable<{ status: number; data: IRegisterResponse; message: string }> {
    return this._ApiService.postReq('register', signUpData);
  }

  logOut(): Observable<{ status: number; data: null; message: string }> {
    return this._ApiService.postReq('logout', '');
  }

  refreshToken(): Observable<{ status: number; data: string; message: string }>{
    return this._ApiService.postReq('checkToken', '');
  }

  forgetPassword(email:string): Observable<{ status: number; data: null; message: string }>{
    return this._ApiService.postReq('sendResetMailService', {email});
  }

  resetPassword(acc:any): Observable<{ status: number; data: null; message: string }>{
    return this._ApiService.postReq('getResetMailService', acc);
  }
}
