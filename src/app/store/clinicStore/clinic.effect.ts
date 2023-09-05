import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, of, catchError } from 'rxjs';
import { ClinicService } from 'src/app/services/clinic.service';
import * as fromClinicActions from '../clinicStore/clinic.action';

@Injectable()
export class ClinicEffects {
  constructor(
    private actions$: Actions,
    private _ClinicService: ClinicService
  ) {}

  emirateEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromClinicActions.FETCH_CLINIC_EMIRATES_START),
      exhaustMap((action) =>
        this._ClinicService.getEmirateAppointments().pipe(
          map((res) =>
            fromClinicActions.FETCH_CLINIC_EMIRATES_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(fromClinicActions.FETCH_CLINIC_EMIRATES_FAILED({ error: error }))
          )
        )
      )
    )
  );

  checkoutEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromClinicActions.FETCH_CLINIC_CHECKOUT_START),
      exhaustMap((action) =>
        this._ClinicService.bookAppointmentInClinic(action.data).pipe(
          map((res) =>
            fromClinicActions.FETCH_CLINIC_CHECKOUT_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(fromClinicActions.FETCH_CLINIC_CHECKOUT_FAILED({ error: error }))
          )
        )
      )
    )
  );
}
