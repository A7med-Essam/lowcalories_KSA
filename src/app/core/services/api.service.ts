import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getReq(endPoint: string, params?: HttpParams): Observable<any> {
    return this.http
      .get(environment.BaseUrl + endPoint, { params: params })
      .pipe(retry(1));
  }

  postReq(endPoint: string, body: any, params?: HttpParams): Observable<any> {
    return this.http
      .post(environment.BaseUrl + endPoint, body, { params: params })
      .pipe(retry(1));
  }

  postReqV3(endPoint: string, body: any, params?: HttpParams): Observable<any> {
    return this.http
      .post(environment.BaseUrlV3 + endPoint, body, { params: params })
      .pipe(retry(1));
  }
}
