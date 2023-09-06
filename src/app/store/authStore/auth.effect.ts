import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { exhaustMap, map, of, catchError, tap, defer } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import * as fromAuthActions from './auth.action';
import { Router } from '@angular/router';
import { LocalService } from 'src/app/services/local.service';
import { Store } from '@ngrx/store';
import { ILoginResponse } from 'src/app/interfaces/auth.interface';

@Injectable()
export class AuthEffect implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private _AuthService: AuthService,
    private _Router: Router,
    private _LocalService: LocalService,
    private _Store: Store
  ) {}

  ngrxOnInitEffects() {
    let user: ILoginResponse =
      this._LocalService.getJsonValue('lowcalories_KSA');
    return fromAuthActions.LOGIN_SUCCESS({
      data: user,
      message: '',
      status: 1,
    });
  }

  loginEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuthActions.LOGIN_START),
      exhaustMap((action) =>
        this._AuthService
          .signIn({ email: action.data.email, password: action.data.password })
          .pipe(
            map((res) =>
              fromAuthActions.LOGIN_SUCCESS({
                data: res.data,
                message: res.message,
                status: res.status,
              })
            ),
            tap((res) => {
              if (res.status == 1) {
                this._LocalService.setJsonValue('lowcalories_KSA', res.data);
                this._Router.navigate(['/home']);
              }
            }),
            catchError((error: HttpErrorResponse) =>
              of(fromAuthActions.LOGIN_FAILED({ error: error }))
            )
          )
      )
    )
  );

  logout = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuthActions.LOGOUT_START),
      exhaustMap((action) =>
        this._AuthService.logOut().pipe(
          map((res) =>
            fromAuthActions.LOGOUT_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          tap((res) => {
            this._LocalService.removeItem('lowcalories_KSA');
            this._Router.navigate(['login']);
          }),
          catchError((error: HttpErrorResponse) =>
            of(fromAuthActions.LOGOUT_FAILED({ error: error }))
          )
        )
      )
    )
  );

  registerEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuthActions.REGISTER_START),
      exhaustMap((action) =>
        this._AuthService.signUp(action.data).pipe(
          map((res) =>
            fromAuthActions.REGISTER_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          tap((res) => {
            if (res.status == 1) {
              this._Store.dispatch(
                fromAuthActions.LOGIN_START({
                  data: {
                    email: action.data.email,
                    password: action.data.password,
                  },
                })
              );
              this._LocalService.setJsonValue('lowcalories_KSA', res.data);
              this._Router.navigate(['/home']);
            }
          }),
          catchError((error: HttpErrorResponse) =>
            of(fromAuthActions.REGISTER_FAILED({ error: error }))
          )
        )
      )
    )
  );
}
