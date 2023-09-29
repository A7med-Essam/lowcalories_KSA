import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, of } from 'rxjs';
import * as fromNormalPlanSelector from 'src/app/store/normalPlanStore/normalPlan.selector';
import { SharedService } from 'src/app/services/shared.service';
import {
  Dish,
  INormalPlanResponse,
  IShowMealsResponse,
  Meal,
} from 'src/app/interfaces/normal-plan.interface';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FETCH_NORMALPLAN_PRICE_START, SAVE_NORMAL_MEALS } from 'src/app/store/normalPlanStore/normalPlan.action';
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
  ProgramMeals!: Observable<IShowMealsResponse[] | null>;
  userMeals: IShowMealsResponse[]=[];
  ProgramDetails!: Observable<INormalPlanResponse | null>;
  nextButtonMode$: Observable<boolean | null> = of(false);
  mealDetailsModal: boolean = false;
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
  currentMeal!: Meal;
  currentMealIndex:number = 0;

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
          this.userMeals = res 
          
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

  toggleCategories(e: Event, index: number) {
    this.category_index = index;
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
          this._Store.dispatch(SAVE_NORMAL_MEALS({ data: this.userMeals }));
          this._Store.dispatch(
            FETCH_NORMALPLAN_PRICE_START({
              data: {
                subscription_day_count: res.subscription_days,
                meal_count: res.meals.length,
                program_id: res.program_id,
                snack_count: res.snacks.length,
                list_days: this.userMeals
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

  openDetails(meal:Meal,index:number) {
    this.currentMealIndex = index;
    this.currentMeal = meal;
    this.mealDetailsModal = true;
  }

  editMeal(meal: Meal) {
    // Make a shallow copy of userMeals to avoid mutating the original array
    const updatedUserMeals = [...this.userMeals];
  
    // Find the meal with the same date as the current category
    const categoryMeal = updatedUserMeals[this.category_index];
  
    if (categoryMeal) {
      const updatedMeals = [...categoryMeal.meals];
  
      // Update the meal at the currentMealIndex with the new meal
      updatedMeals[this.currentMealIndex] = meal;
  
      // Update the userMeals array with the updated meals for the same date
      updatedUserMeals[this.category_index] = {
        ...categoryMeal,
        meals: updatedMeals,
      };
  
      // Update the userMeals property with the new array
      this.userMeals = updatedUserMeals;
    }
  }

  changeMainDishNutrition(meal: Meal, increase: boolean) {
    const modifiedMeal: Meal = { ...meal };
    const mainDish: Dish = { ...meal.mainDish };
    const newQty = increase? Math.min(mainDish.qty + mainDish.counter): Math.max(mainDish.qty - mainDish.counter,mainDish.min_qty);
    mainDish.qty = newQty;
    mainDish.calories = this.calcNutrition(mainDish, meal,'calories');
    mainDish.fat = this.calcNutrition(mainDish, meal,'fat');
    mainDish.carb = this.calcNutrition(mainDish, meal,'carb');
    mainDish.protein = this.calcNutrition(mainDish, meal,'protein');
    modifiedMeal.mainDish = mainDish;
    this.currentMeal = modifiedMeal;
  }
  
  changeSideDishNutrition(meal: Meal, increase: boolean, index: number) {
    // Clone the entire meal object to ensure mutability
    const modifiedMeal: Meal = JSON.parse(JSON.stringify(meal));
    
    // Ensure that the specified index is within the bounds of the sideDish array
    if (index >= 0 && index < modifiedMeal.sideDish.length) {
      const sideDish: Dish = modifiedMeal.sideDish[index];
      const newQty = increase ? Math.min(sideDish.qty + sideDish.counter) : Math.max(sideDish.qty - sideDish.counter, sideDish.min_qty);
  
      // Update the quantity for the specific side dish
      sideDish.qty = newQty;
  
      // Recalculate nutrition information for all side dishes
      modifiedMeal.sideDish.forEach((e, i) => {
        e.calories = this.calcNutrition2(e, modifiedMeal, 'calories', i);
        e.fat = this.calcNutrition2(e, modifiedMeal, 'fat', i);
        e.carb = this.calcNutrition2(e, modifiedMeal, 'carb', i);
        e.protein = this.calcNutrition2(e, modifiedMeal, 'protein', i);
      });
      this.currentMeal = modifiedMeal;
    }
  }

  calcNutrition(meal: Dish,originalMeal: any, type:string) {
    const caloriesPercentage = Number(originalMeal.mainDish[type]) / Number(originalMeal.mainDish.qty)
    return (Number(caloriesPercentage || 0) * Number(meal.qty));
  }

  calcNutrition2(meal: Dish,originalMeal: any, type:string,index:number) {
    const caloriesPercentage = Number(originalMeal.sideDish[index][type]) / Number(this.currentMeal.sideDish[index].qty)
    return (Number(caloriesPercentage || 0) * Number(meal.qty));
  }

}
