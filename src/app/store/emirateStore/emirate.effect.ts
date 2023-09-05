import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, of, catchError } from 'rxjs';
import { EmiratesService } from 'src/app/services/emirates.service';
import * as fromEmirateActions from '../emirateStore/emirate.action';

@Injectable()
export class EmirateEffects {
  constructor(
    private actions$: Actions,
    private _EmiratesService: EmiratesService
  ) {}

  emirateEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromEmirateActions.FETCH_EMIRATE_START),
      exhaustMap((action) =>
        this._EmiratesService.getEmirates(action.programType).pipe(
          map((res) =>
            fromEmirateActions.FETCH_EMIRATE_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(fromEmirateActions.FETCH_EMIRATE_FAILED({ error: error }))
          )
        )
      )
    )
  );
}
