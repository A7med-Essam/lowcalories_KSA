import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, of, catchError, tap } from 'rxjs';
import { CustomPlanService } from 'src/app/services/plans/custom-plan.service';
import * as fromCustomPlanActions from '../customPlanStore/customPlan.action';

@Injectable()
export class CustomPlanEffects {
  constructor(
    private actions$: Actions,
    private _CustomPlanService: CustomPlanService,
    private _Router: Router 
  ) {}

  // GET PROGRAM
  customPlanEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomPlanActions.FETCH_CUSTOMPLAN_START),
      exhaustMap((action) =>
        this._CustomPlanService.getCustomProgramDetails(action.program_id).pipe(
          map((res) =>
            fromCustomPlanActions.FETCH_CUSTOMPLAN_SUCCESS({
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
            of(fromCustomPlanActions.FETCH_CUSTOMPLAN_FAILED({ error: error }))
          )
        )
      )
    )
  );

  // get meals
  showMealsEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomPlanActions.FETCH_CUSTOMPLAN_SHOWMEALS_START),
      exhaustMap((action) =>
        this._CustomPlanService.getCustomMeals(action.plan_id).pipe(
          map((res) =>
            fromCustomPlanActions.FETCH_CUSTOMPLAN_SHOWMEALS_SUCCESS({
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
              const otherPath = 'select-meals';
              const newUrl = `${currentUrl}${otherPath}`;
              this._Router.navigateByUrl(newUrl);
            }
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              fromCustomPlanActions.FETCH_CUSTOMPLAN_SHOWMEALS_FAILED({
                error: error,
              })
            )
          )
        )
      )
    )
  );

  // get categories
  showCategoriesEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomPlanActions.FETCH_CUSTOMPLAN_SHOWCATEGORIES_START),
      exhaustMap((action) =>
        this._CustomPlanService.getMealCategories(action.plan_id).pipe(
          map((res) =>
            fromCustomPlanActions.FETCH_CUSTOMPLAN_SHOWCATEGORIES_SUCCESS({
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
            of(
              fromCustomPlanActions.FETCH_CUSTOMPLAN_SHOWCATEGORIES_FAILED({
                error: error,
              })
            )
          )
        )
      )
    )
  );

  // GET PRICE
  getPriceEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomPlanActions.FETCH_CUSTOMPLAN_PRICE_START),
      exhaustMap((action) =>
        this._CustomPlanService
          .getCustomProgramPrice(action.data)
          .pipe(
            map((res) =>
              fromCustomPlanActions.FETCH_CUSTOMPLAN_PRICE_SUCCESS({
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
                fromCustomPlanActions.FETCH_CUSTOMPLAN_PRICE_FAILED({
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
      ofType(fromCustomPlanActions.FETCH_CHECKOUT_START),
      exhaustMap((action) =>
        this._CustomPlanService.checkout(action.data).pipe(
          map((res) =>
            fromCustomPlanActions.FETCH_CHECKOUT_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(fromCustomPlanActions.FETCH_CHECKOUT_FAILED({ error: error }))
          )
        )
      )
    )
  );
}
