import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, of, catchError, tap } from 'rxjs';
import { ProgramService } from 'src/app/services/program.service';
import * as fromProgramActions from '../programStore/program.action';

@Injectable()
export class ProgramEffects {
  constructor(
    private actions$: Actions,
    private _ProgramService: ProgramService,
  ) {}

  programEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromProgramActions.FETCH_PROGRAM_START),
      exhaustMap((action) =>
        this._ProgramService.getPrograms()
          .pipe(
            map((res) =>
            fromProgramActions.FETCH_PROGRAM_SUCCESS({
                data: res.data,
                message: res.message,
                status: res.status,
              })
            ),
            catchError((error: HttpErrorResponse) =>
              of(fromProgramActions.FETCH_PROGRAM_FAILED({ error: error }))
            )
          )
      )
    )
  );

}