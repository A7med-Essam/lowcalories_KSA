import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, of, catchError, tap } from 'rxjs';
import { NormalPlanService } from 'src/app/services/plans/normal-plan.service';
import * as fromNormalPlanActions from '../normalPlanStore/normalPlan.action';

@Injectable()
export class NormalPlanEffects {
  constructor(
    private actions$: Actions,
    private _NormalPlanService: NormalPlanService,
    private _Router: Router,
  ) {}

  // GET PROGRAM
  normalPlanEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromNormalPlanActions.FETCH_NORMALPLAN_START),
      exhaustMap((action) =>
        this._NormalPlanService.getNormalProgramDetails(action.program_id).pipe(
          map((res) =>
            fromNormalPlanActions.FETCH_NORMALPLAN_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          tap((res) => {
            if (res.status == 0) {
              this._Router.navigate(['/plans']);
            }
          }),
          catchError((error: HttpErrorResponse) =>
            of(fromNormalPlanActions.FETCH_NORMALPLAN_FAILED({ error: error }))
          )
        )
      )
    )
  );

  // SHOW MEALS
  showMealsEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromNormalPlanActions.FETCH_SHOWMEALS_START),
      exhaustMap((action) =>
        this._NormalPlanService.getMeals(action.data).pipe(
          map((res) =>
            fromNormalPlanActions.FETCH_SHOWMEALS_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          tap((res) => {
            if (res.status == 0) {
              this._Router.navigate(['/plans']);
            } else {
              const currentUrl = this._Router.url.replace('set-plan', '');
              const otherPath = 'show-meals';
              const newUrl = `${currentUrl}${otherPath}`;
              this._Router.navigateByUrl(newUrl);
            }
          }),
          catchError((error: HttpErrorResponse) =>
            of(fromNormalPlanActions.FETCH_SHOWMEALS_FAILED({ error: error }))
          )
        )
      )
    )
  );

  // GET PRICE
  getPriceEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromNormalPlanActions.FETCH_NORMALPLAN_PRICE_START),
      exhaustMap((action) =>
        this._NormalPlanService
          .getNormalProgramPrice({
            day_count: action.data.day_count,
            meal_count: action.data.meal_count,
            program_id: action.data.program_id,
            snack_count: action.data.snack_count,
          })
          .pipe(
            map((res) =>
              fromNormalPlanActions.FETCH_NORMALPLAN_PRICE_SUCCESS({
                data: res.data,
                message: res.message,
                status: res.status,
              })
            ),
            tap((res) => {
              if (res.status == 0) {
                this._Router.navigate(['/plans']);
              } else {
                const currentUrl = this._Router.url.replace('show-meals', '');
                const otherPath = 'checkout';
                const newUrl = `${currentUrl}${otherPath}`;
                this._Router.navigateByUrl(newUrl);
              }
            }),
            catchError((error: HttpErrorResponse) =>
              of(
                fromNormalPlanActions.FETCH_NORMALPLAN_PRICE_FAILED({
                  error: error,
                })
              )
            )
          )
      )
    )
  );


  // Checkout
  checkoutEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromNormalPlanActions.FETCH_CHECKOUT_START),
      exhaustMap((action) =>
        this._NormalPlanService.checkout(action.data).pipe(
          map((res) =>
            fromNormalPlanActions.FETCH_CHECKOUT_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(fromNormalPlanActions.FETCH_CHECKOUT_FAILED({ error: error }))
          )
        )
      )
    )
  );
}
