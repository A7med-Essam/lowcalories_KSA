import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, of, catchError } from 'rxjs';
import { DislikeService } from 'src/app/services/dislike.service';
import * as fromDislikeActions from '../dislikeStore/dislike.action';

@Injectable()
export class DislikeEffects {
  constructor(
    private actions$: Actions,
    private _DislikeService: DislikeService
  ) {}

  dislikeEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromDislikeActions.FETCH_DISLIKE_START),
      exhaustMap((action) =>
        this._DislikeService.getDislikeMeals().pipe(
          map((res) =>
            fromDislikeActions.FETCH_DISLIKE_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(fromDislikeActions.FETCH_DISLIKE_FAILED({ error: error }))
          )
        )
      )
    )
  );
}
