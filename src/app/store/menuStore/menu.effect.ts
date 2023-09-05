import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, of, catchError } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';
import * as fromMenuActions from './menu.action';

@Injectable()
export class MenuEffects {
  constructor(
    private actions$: Actions,
    private _MenuService: MenuService
  ) {}

  menuEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromMenuActions.FETCH_MENU_START),
      exhaustMap((action) =>
        this._MenuService.getMenu().pipe(
          map((res) =>
          fromMenuActions.FETCH_MENU_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(fromMenuActions.FETCH_MENU_FAILED({ error: error }))
          )
        )
      )
    )
  );
}
