import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, of, catchError, tap } from 'rxjs';
import { NormalPlanService } from 'src/app/services/plans/normal-plan.service';
import * as fromNormalPlanActions from '../normalPlanStore/normalPlan.action';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class NormalPlanEffects {
  constructor(
    private actions$: Actions,
    private _NormalPlanService: NormalPlanService,
    private _Router: Router,
    private translate:TranslateService
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
              Swal.fire({
                icon: 'error',
                title: this.translate.currentLang == 'ar' ? 'أُووبس...' : 'Oops...',
                text: this.translate.currentLang == 'ar' ?'هناك مشكلة. يرجى الاتصال بخدمة العملاء لدينا':`There's an issue. Please call our Customer Service`,
                confirmButtonText:
                  this.translate.currentLang == 'ar' ? 'حسنا' : 'OK',
              });
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
              Swal.fire({
                icon: 'error',
                title: this.translate.currentLang == 'ar' ? 'أُووبس...' : 'Oops...',
                text: this.translate.currentLang == 'ar' ?'هناك مشكلة. يرجى الاتصال بخدمة العملاء لدينا':`There's an issue. Please call our Customer Service`,
                confirmButtonText:
                this.translate.currentLang == 'ar' ? 'حسنا' : 'OK',
              });
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
          .getNormalProgramPrice(action.data)
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
                Swal.fire({
                  icon: 'error',
                  title: this.translate.currentLang == 'ar' ? 'أُووبس...' : 'Oops...',
                  text: this.translate.currentLang == 'ar' ?'هناك مشكلة. يرجى الاتصال بخدمة العملاء لدينا':`There's an issue. Please call our Customer Service`,
                  confirmButtonText:
                    this.translate.currentLang == 'ar' ? 'حسنا' : 'OK',
                });
                this._Router.navigate(['/plans']);
              } else {
                if (!Array.isArray(res.data.extra_details)) {
                  const currentUrl = this._Router.url.replace('show-meals', '');
                  const otherPath = 'checkout';
                  const newUrl = `${currentUrl}${otherPath}`;
                  this._Router.navigateByUrl(newUrl);
                }
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
