import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, of, catchError } from 'rxjs';
import { ProfileService } from 'src/app/services/profile.service';
import * as fromProfileActions from '../profileStore/profile.action';

@Injectable()
export class ProfileEffects {
  constructor(
    private actions$: Actions,
    private _ProfileService: ProfileService
  ) {}

  profileReplacementEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromProfileActions.FETCH_PROFILE_REPLACEMENT_MEALS_START),
      exhaustMap((action) =>
        this._ProfileService.getProfileMeals(action.data).pipe(
          map((res) =>
            fromProfileActions.FETCH_PROFILE_REPLACEMENT_MEALS_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(fromProfileActions.FETCH_PROFILE_REPLACEMENT_MEALS_FAILED({ error: error }))
          )
        )
      )
    )
  );

  profileChangeMealEffect = createEffect(() =>
  this.actions$.pipe(
    ofType(fromProfileActions.FETCH_PROFILE_CHANGE_MEALS_START),
    exhaustMap((action) =>
      this._ProfileService.changeMeal(action.data).pipe(
        map((res) =>
          fromProfileActions.FETCH_PROFILE_CHANGE_MEALS_SUCCESS({
            data: res.data,
            message: res.message,
            status: res.status,
          })
        ),
        catchError((error: HttpErrorResponse) =>
          of(fromProfileActions.FETCH_PROFILE_CHANGE_MEALS_FAILED({ error: error }))
        )
      )
    )
  )
);
}
