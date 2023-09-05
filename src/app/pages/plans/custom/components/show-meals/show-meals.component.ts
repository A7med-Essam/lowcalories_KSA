import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import { ICards } from 'src/app/interfaces/custom-plan.interface';
import { SharedService } from 'src/app/services/shared.service';
import { FETCH_CUSTOMPLAN_PRICE_START } from 'src/app/store/customPlanStore/customPlan.action';
import {
  CustomCardsSelector,
  customPlanPriceLoadingSelector,
  CustomSubscriptionSelector,
} from 'src/app/store/customPlanStore/customPlan.selector';

@Component({
  selector: 'app-show-meals',
  templateUrl: './show-meals.component.html',
  styleUrls: ['./show-meals.component.scss'],
})
export class ShowMealsComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void> = new Subject();
  nextButtonMode$: Observable<boolean | null> = of(false);
  CurrentIndex: number = 0;
  cards!: Observable<ICards[] | null>;
  categoryOptions: OwlOptions = {
    dots: false,
    nav: false,
    margin: 20,
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  };
  carouselVisible:boolean = true;

  constructor(
    private _I18nService: I18nService,
    public translate: TranslateService,
    private _Store: Store,
    private _SharedService: SharedService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute
  ) {
    this._I18nService.getCurrentLang(this.translate);
    this.cards = _Store.select(CustomCardsSelector);
    _Store
      .select(CustomCardsSelector)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res == null) {
          this._Router.navigate(['set-plan'], {
            relativeTo: this._ActivatedRoute.parent,
          });
        }
      });
      if (this._I18nService.currentLang == 'ar') {
        this.categoryOptions.rtl = true;
      }
      this.translate.onLangChange.pipe(takeUntil(this.destroyed$)).subscribe(res=>{
        if (res.lang == 'ar') {
          this.categoryOptions.rtl = true;
        }else{
          this.categoryOptions.rtl = false;
        }
        this.carouselVisible = false;
  
        setTimeout(() => {
          this.carouselVisible = true;
        });
    
      })

  }



  toggleDates(e: HTMLElement) {
    e.classList.add('active');
    const Siblings = this._SharedService.getAllSiblings(
      e.parentElement?.parentElement,
      e.parentElement?.parentElement?.parentElement
    );
    Siblings.forEach((e: HTMLElement) => {
      e.children[0]?.children[0]?.classList.remove('active');
    });
  }

  toggleCards(index: number) {
    this.CurrentIndex = index;
  }

  getCheckout() {
    this.nextButtonMode$ = this._Store.select(customPlanPriceLoadingSelector);

    this._Store
      .select(CustomSubscriptionSelector)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res) {
          this._Store.dispatch(
            FETCH_CUSTOMPLAN_PRICE_START({
              data: {
                day_count: Number(res.number_of_Days),
                meal_count: res.number_of_Meals.length,
                plan_id: res.Plan_Type.id,
                snack_count: res.number_of_Snacks,
              },
            })
          );
        }
      });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
