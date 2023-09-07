import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, of } from 'rxjs';
import * as fromNormalPlanSelector from 'src/app/store/normalPlanStore/normalPlan.selector';
import { SharedService } from 'src/app/services/shared.service';
import {
  INormalPlanResponse,
  IShowMealsResponse,
} from 'src/app/interfaces/normal-plan.interface';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FETCH_NORMALPLAN_PRICE_START } from 'src/app/store/normalPlanStore/normalPlan.action';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-showMeals',
  templateUrl: './showMeals.component.html',
  styleUrls: ['./showMeals.component.scss'],
})
export class ShowMealsComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void> = new Subject();
  category_index: number = 0;
  category_key: string = '';
  ProgramMeals!: Observable<IShowMealsResponse | null>;
  ProgramDetails!: Observable<INormalPlanResponse | null>;
  nextButtonMode$: Observable<boolean | null> = of(false);
  carouselVisible:boolean = true;
  customOptions: OwlOptions = {
    loop: false,
    autoplay: false,
    dots: false,
    margin: 20,
    items: 3,
    responsive: {
      0: {
        items: 2,
      },
      768: {
        items: 3,
      },
      1024: {
        items: 4,
      },
      1200: {
        items: 5,
      },
    },
  };

  constructor(
    private _SharedService: SharedService,
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private _Store: Store,
    private _I18nService: I18nService,
    public translate: TranslateService,
  ) {
    this._I18nService.getCurrentLang(this.translate);
    _Store
      .select(fromNormalPlanSelector.showMealsSelector)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res) {
          this.category_key = Object.keys(res)[0];
          this.ProgramDetails = _Store.select(
            fromNormalPlanSelector.normalPlanSelector
          );
          this.ProgramMeals = _Store.select(
            fromNormalPlanSelector.showMealsSelector
          );
        } else {
          this._Router.navigate(['set-plan'], {
            relativeTo: this._ActivatedRoute.parent,
          });
        }
      });
      if (this._I18nService.currentLang == 'ar') {
        this.customOptions.rtl = true;
      }
      this.translate.onLangChange.pipe(takeUntil(this.destroyed$)).subscribe(res=>{
        if (res.lang == 'ar') {
          this.customOptions.rtl = true;
        }else{
          this.customOptions.rtl = false;
        }
        this.carouselVisible = false;
  
        setTimeout(() => {
          this.carouselVisible = true;
        });
    
      })
  }

  ngOnInit(): void {}

  toggleCategories(e: Event, index: number, key:string) {
    this.category_index = index;
    this.category_key = key;
    this._SharedService.toggleCategories(e);
  }

  getCheckout() {
    this.nextButtonMode$ = this._Store.select(
      fromNormalPlanSelector.normalPlanPriceLoadingSelector
    );

    this._Store
      .select(fromNormalPlanSelector.normalSubscriptionSelector)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res) {
          this._Store.dispatch(
            FETCH_NORMALPLAN_PRICE_START({
              data: {
                subscription_day_count: res.subscription_days,
                meal_count: res.meals.length,
                program_id: res.program_id,
                snack_count: res.snacks.length,
              },
            })
          );
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
