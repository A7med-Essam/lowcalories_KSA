import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, of, catchError } from 'rxjs';
import { AddressService } from 'src/app/services/address.service';
import * as fromAddressActions from '../userAddressStore/address.action';

@Injectable()
export class AddressEffects {
  constructor(
    private actions$: Actions,
    private _AddressService: AddressService
  ) {}

  addressEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAddressActions.FETCH_USERADDRESS_START),
      exhaustMap((action) =>
        this._AddressService.getAddress().pipe(
          map((res) =>
            fromAddressActions.FETCH_USERADDRESS_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(fromAddressActions.FETCH_USERADDRESS_FAILED({ error: error }))
          )
        )
      )
    )
  );
}
