import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, of, catchError } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import * as fromStateActions from './state.action';

@Injectable()
export class StateEffects {
  constructor(private actions$: Actions, private _StateService: StateService) {}

  stateEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromStateActions.FETCH_STATE_START),
      exhaustMap((action) =>
        this._StateService.getStates().pipe(
          map((res) =>
            fromStateActions.FETCH_STATE_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(fromStateActions.FETCH_STATE_FAILED({ error: error }))
          )
        )
      )
    )
  );
}
