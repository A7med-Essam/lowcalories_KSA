// import { Injectable, Injector } from '@angular/core';
// import {
//   HttpInterceptor,
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpResponse,
//   HttpErrorResponse,
// } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import Swal from 'sweetalert2';
// import { TranslateService } from '@ngx-translate/core';

// @Injectable()
// export class ErrorHandlerInterceptor implements HttpInterceptor {

//   constructor(private _injector: Injector) { }

//   get translate() {
//     return this._injector.get(TranslateService);
//   }
//   isSwalOpen = false; // Initialize a variable to track the modal state


//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     const baseUrlToCheck = 'https://thelowcalories.com:74';

//     if(!request.url.startsWith(baseUrlToCheck)){
//       return next.handle(request).pipe(
//         catchError((error: HttpErrorResponse) => {
//           if (error.status === 500) {
//             if (!this.isSwalOpen) {
//             Swal.fire({
//               icon: 'error',
//               title: this.translate.currentLang == 'ar' ? 'أُووبس...' : 'Oops...',
//               html: this.translate.currentLang == 'ar' ?'هناك مشكلة. يرجى الاتصال بخدمة العملاء لدينا <a target="_blank" href="https://api.whatsapp.com/send?phone=9660595036614"> أضغط هنا </a> ':`There's an issue. Please call our Customer Service 
//               <a target="_blank" href="https://api.whatsapp.com/send?phone=9660595036614"> Here </a>`,
//               confirmButtonText:
//                 this.translate.currentLang == 'ar' ? 'حسنا' : 'OK',
//             }).then((result) => {
//               if (result.isConfirmed || result.isDismissed) {
//                 this.isSwalOpen = false; // Reset the modal state when it's closed
//               }
//             });
//             this.isSwalOpen = true; // Set the modal state to open
//             }
//         }
//           return throwError(() => new Error('UnExpected Error!'));
//         })
//       );
//     }else{
//       return next.handle(request);
//     }
//   }
// }
import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private _injector: Injector) { }

  get translate() {
    return this._injector.get(TranslateService);
  }

  isSwalOpen = false;
  isRetrying = false; // Flag to track whether a retry is in progress

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const baseUrlToCheck = 'https://thelowcalories.com:74';

    if (!request.url.startsWith(baseUrlToCheck)) {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 500) {
            if (!this.isSwalOpen) {
              if (!this.isRetrying) {
                // First error, retry the request
                this.isRetrying = true;
                return next.handle(request).pipe(
                  retry(1), // Retry the request once
                  catchError((retryError: HttpErrorResponse) => {
                    this.isRetrying = false; // Reset the retry flag
                    this.showSwalError();
                    return throwError(()=>retryError);
                  })
                );
              } else {
                // Second error, show the SweetAlert2 modal
                this.showSwalError();
              }
            }
          }
          return throwError(() => new Error('UnExpected Error!'));
        })
      );
    } else {
      return next.handle(request);
    }
  }

  private showSwalError() {
    Swal.fire({
      icon: 'error',
      title: this.translate.currentLang == 'ar' ? 'أُووبس...' : 'Oops...',
      html: this.translate.currentLang == 'ar'
        ? 'هناك مشكلة. يرجى الاتصال بخدمة العملاء لدينا <a target="_blank" href="https://api.whatsapp.com/send?phone=9660595036614"> أضغط هنا </a>'
        : 'There\'s an issue. Please call our Customer Service <a target="_blank" href="https://api.whatsapp.com/send?phone=9660595036614"> Here </a>',
      confirmButtonText: this.translate.currentLang == 'ar' ? 'حسنا' : 'OK',
    }).then((result) => {
      if (result.isConfirmed || result.isDismissed) {
        this.isSwalOpen = false; // Reset the modal state when it's closed
      }
    });
    this.isSwalOpen = true; // Set the modal state to open
  }
}
