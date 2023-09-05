import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';
import { LocalService } from 'src/app/services/local.service';
import { AuthService } from 'src/app/services/auth.service';
import { Store } from '@ngrx/store';
import { LOGOUT_SUCCESS } from 'src/app/store/authStore/auth.action';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private _LocalService: LocalService,
    private _AuthService: AuthService,
    private _Store: Store,
    private _Router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const currentLang: string =
      this._LocalService.getJsonValue('currentLang') || 'en';
    let HttpHeader;
    if (this._LocalService.getJsonValue('lowcaloriesAE_new')) {
      HttpHeader = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${this._LocalService.getJsonValue('lowcaloriesAE_new').auth_token}`,
          'lang': currentLang
        }
      });
      return next.handle(HttpHeader).pipe(
        tap((res: any) => {
          if (res?.body?.message === 'unauthenticated') {
            this._AuthService
              .refreshToken()
              .pipe(
                switchMap((res) => {
                  if (res.data) {
                    const item =
                      this._LocalService.getJsonValue('lowcaloriesAE_new');
                    item.auth_token = res.data;
                    this._LocalService.setJsonValue('lowcaloriesAE_new', item);
                    const newRequest = request.clone({
                      setHeaders: {
                        'Authorization': `Bearer ${this._LocalService.getJsonValue('lowcaloriesAE_new').auth_token}`,
                        'lang': currentLang
                      }
                    });
                    return next.handle(newRequest);
                  } else {
                    Swal.fire({
                      title:
                        currentLang == 'ar'
                          ? 'لقد انتهت فترة دخولك إلى النظام'
                          : 'The session has expired!',
                      text:
                        currentLang == 'ar'
                          ? 'الرجاء تسجيل الدخول'
                          : 'Please login',
                      icon: 'error',
                      confirmButtonText: currentLang == 'ar'? "تأكيد":'Confirm',
                    });
                    this._Store.dispatch(
                      LOGOUT_SUCCESS({ data: null, message: '', status: 0 })
                    );
                    this._LocalService.removeItem('lowcaloriesAE_new');
                    this._Router.navigate(['login']);
                    return next.handle(request);
                  }
                })
              )
              .subscribe();
          }
        })
      );
    }
    else{
      request = request.clone({
        setHeaders: {
          'lang': currentLang
        }
      });
    }
    return next.handle(request);
  }
}
