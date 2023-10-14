import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private _injector: Injector) { }

  get translate() {
    return this._injector.get(TranslateService);
  }


  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 500) {
          Swal.fire({
            icon: 'error',
            title: this.translate.currentLang == 'ar' ? 'أُووبس...' : 'Oops...',
            text: this.translate.currentLang == 'ar' ?'هناك مشكلة. يرجى الاتصال بخدمة العملاء لدينا':`There's an issue. Please call our Customer Service`,
            confirmButtonText:
              this.translate.currentLang == 'ar' ? 'حسنا' : 'OK',
          });
        }
        return throwError(() => new Error('UnExpected Error!'));
      })
    );
  }
}