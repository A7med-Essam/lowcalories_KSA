import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, of, catchError } from 'rxjs';
import { TermsService } from 'src/app/services/terms.service';
import * as fromTermsActions from '../termsStore/terms.action';

@Injectable()
export class TermsEffects {
  constructor(
    private actions$: Actions,
    private _TermsService: TermsService
  ) {}

  termsEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromTermsActions.FETCH_TERMS_START),
      exhaustMap((action) =>
        this._TermsService.getTerms().pipe(
          map((res) =>
            fromTermsActions.FETCH_TERMS_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(fromTermsActions.FETCH_TERMS_FAILED({ error: error }))
          )
        )
      )
    )
  );
}
