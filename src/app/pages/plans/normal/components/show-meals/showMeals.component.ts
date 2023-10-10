import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, of, map } from 'rxjs';
import * as fromNormalPlanSelector from 'src/app/store/normalPlanStore/normalPlan.selector';
import { SharedService } from 'src/app/services/shared.service';
import {
  Dish,
  INormalPlanResponse,
  INormalProgramPriceResponse,
  IShowMealsResponse,
  ISubscriptionData,
  Meal,
} from 'src/app/interfaces/normal-plan.interface';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {
  FETCH_NORMALPLAN_PRICE_START,
  SAVE_NORMAL_MEALS,
} from 'src/app/store/normalPlanStore/normalPlan.action';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import { TranslateService } from '@ngx-translate/core';
import { Extra } from 'src/app/interfaces/giftcode.interface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-showMeals',
  templateUrl: './showMeals.component.html',
  styleUrls: ['./showMeals.component.scss'],
  providers: [MessageService],
})
export class ShowMealsComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void> = new Subject();
  category_index: number = 0;
  ProgramMeals!: Observable<IShowMealsResponse[] | null>;
  userMeals: IShowMealsResponse[] = [];
  ProgramDetails!: Observable<INormalPlanResponse | null>;
  nextButtonMode$: Observable<boolean | null> = of(false);
  mealDetailsModal: boolean = false;
  carouselVisible: boolean = true;
  sidebarOptions: boolean = true;
  ExtraProteinOverAll: number = 0;
  ExtraCarbOverAll: number = 0;
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
  currentMealIndex: number = 0;
  price$: Observable<INormalProgramPriceResponse | null> = of(null);
  program_extra_prices:{carb:number,protein:number} = {carb:0,protein:0};
  selected_program!:ISubscriptionData;
  constructor(
    private _SharedService: SharedService,
    private _ActivatedRoute: ActivatedRoute,
    private _MessageService: MessageService,
    private _Router: Router,
    private _Store: Store,
    private _I18nService: I18nService,
    public translate: TranslateService
  ) {
    this._I18nService.getCurrentLang(this.translate);
    _Store
      .select(fromNormalPlanSelector.showMealsSelector)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res) {
          this.userMeals = res;
          this.price$ = _Store.select(
            fromNormalPlanSelector.normalPlanPriceSelector
          );

          this.ProgramDetails = _Store.select(
            fromNormalPlanSelector.normalPlanSelector
          );
          this.ProgramDetails
          .pipe(takeUntil(this.destroyed$))
          .subscribe(res=>{
            if (res) {
              this.program_extra_prices = res.extra_prices
            }else{
              this.program_extra_prices = {carb:2,protein:6}
            }
          })
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
    this.translate.onLangChange
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res.lang == 'ar') {
          this.customOptions.rtl = true;
        } else {
          this.customOptions.rtl = false;
        }
        this.carouselVisible = false;

        setTimeout(() => {
          this.carouselVisible = true;
        });
      });

      this._Store
      .select(fromNormalPlanSelector.normalSubscriptionSelector)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res) {
          this.selected_program = res
        }
      });
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
                list_days: this.userMeals,
                global_extra_carb:this.ExtraCarbOverAll,
                global_extra_protein:this.ExtraProteinOverAll
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

  openDetails(meal: Meal, index: number) {
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



  changeMainDishNutrition(originalMeal: Meal, increase: boolean) {
    if (originalMeal.mainDish.tag) {
      const modifiedMeal: Meal = JSON.parse(JSON.stringify(originalMeal));
      const mainDish: Dish = modifiedMeal.mainDish;
      if (increase) {
        mainDish.tag == 'p'
          ? Math.min((mainDish.extra.protein += mainDish.counter))
          : Math.min((mainDish.extra.carb += mainDish.counter));
      } else {
        mainDish.tag == 'p'
          ? (mainDish.extra.protein = Math.max(
              mainDish.extra.protein - mainDish.counter,
              0
            ))
          : (mainDish.extra.carb = Math.max(
              mainDish.extra.carb - mainDish.counter,
              0
            ));
      }
      mainDish.calories = this.calcNutritionMain(
        mainDish,
        originalMeal,
        'calories'
      );
      mainDish.fat = this.calcNutritionMain(mainDish, originalMeal, 'fat');
      mainDish.carb = this.calcNutritionMain(mainDish, originalMeal, 'carb');
      mainDish.protein = this.calcNutritionMain(
        mainDish,
        originalMeal,
        'protein'
      );
      modifiedMeal.mainDish = mainDish;
      this.currentMeal = modifiedMeal;
      const allMeals: IShowMealsResponse[] = JSON.parse(JSON.stringify(this.userMeals));
      allMeals[this.category_index].meals[this.currentMealIndex] = this.currentMeal
      this.userMeals = allMeals
      this.sumTotalExtra(this.userMeals);
    }

  }



  changeSideDishNutrition(
    originalMeal: Meal,
    increase: boolean,
    index: number
  ) {
    if (originalMeal.sideDish[index].tag) {
      // Clone the entire meal object to ensure mutability
      const modifiedMeal: Meal = JSON.parse(JSON.stringify(originalMeal));

      // Ensure that the specified index is within the bounds of the sideDish array
      if (index >= 0 && index < modifiedMeal.sideDish.length) {
        const sideDish: Dish = modifiedMeal.sideDish[index];

        if (increase) {
          sideDish.tag == 'p'
            ? Math.min((sideDish.extra.protein += sideDish.counter))
            : Math.min((sideDish.extra.carb += sideDish.counter));
        } else {
          sideDish.tag == 'p'
            ? (sideDish.extra.protein = Math.max(
                sideDish.extra.protein - sideDish.counter,
                0
              ))
            : (sideDish.extra.carb = Math.max(
                sideDish.extra.carb - sideDish.counter,
                0
              ));
        }

        // Recalculate nutrition information for all side dishes
        modifiedMeal.sideDish.forEach((e, i) => {
          e.calories = this.calcNutritionSide(e, modifiedMeal, 'calories', i);
          e.fat = this.calcNutritionSide(e, modifiedMeal, 'fat', i);
          e.carb = this.calcNutritionSide(e, modifiedMeal, 'carb', i);
          e.protein = this.calcNutritionSide(e, modifiedMeal, 'protein', i);
        });
        this.currentMeal = modifiedMeal;
      }
      const allMeals: IShowMealsResponse[] = JSON.parse(JSON.stringify(this.userMeals));
      allMeals[this.category_index].meals[this.currentMealIndex] = this.currentMeal
      this.userMeals = allMeals
      this.sumTotalExtra(this.userMeals);
    }
  }

  calcNutritionMain(meal: Dish, originalMeal: any, type: string) {
    const percentage =
      Number(originalMeal.mainDish[type]) /
      Number(
        originalMeal.mainDish.qty +
          originalMeal.mainDish.extra.protein +
          originalMeal.mainDish.extra.carb
      );
    return (
      Number(percentage || 0) *
      Number(meal.qty + meal.extra.carb + meal.extra.protein)
    );
  }

  calcNutritionSide(
    meal: Dish,
    originalMeal: any,
    type: string,
    index: number
  ) {
    const percentage =
      Number(originalMeal.sideDish[index][type]) /
      Number(
        this.currentMeal.sideDish[index].qty +
          this.currentMeal.sideDish[index].extra.protein +
          this.currentMeal.sideDish[index].extra.carb
      );
    return (
      Number(percentage || 0) *
      Number(meal.qty + meal.extra.carb + meal.extra.protein)
    );
  }



  // ======================================================== new logic ========================================================

  calcExtraGramOverAll(increase: boolean) {
    this.ExtraProteinOverAll = increase
    ? Math.min(this.ExtraProteinOverAll + 50,500)
    : Math.max(this.ExtraProteinOverAll - 50, 0);
    this.addExtraGramsToMeals();
  }

  calcExtraPieceOverAll(increase: boolean) {
    this.ExtraCarbOverAll = increase
    ? Math.min(this.ExtraCarbOverAll + 50,500)
    : Math.max(this.ExtraCarbOverAll - 50, 0);
    this.addExtraGramsToMeals();
  }  



  addExtraGramsToMeals() {
    const modifiedMeals: IShowMealsResponse[] = JSON.parse(
      JSON.stringify(this.userMeals)
    );

    for (const day of modifiedMeals) {
      for (const meal of day.meals) {
        // Reset the "extra" object for the dish
        const percentage1 =
          Number(meal.mainDish.calories) /
          Number(
            meal.mainDish.qty +
              meal.mainDish.extra.protein +
              meal.mainDish.extra.carb
          );
        const percentage2 =
          Number(meal.mainDish.fat) /
          Number(
            meal.mainDish.qty +
              meal.mainDish.extra.protein +
              meal.mainDish.extra.carb
          );
        const percentage3 =
          Number(meal.mainDish.carb) /
          Number(
            meal.mainDish.qty +
              meal.mainDish.extra.protein +
              meal.mainDish.extra.carb
          );
        const percentage4 =
          Number(meal.mainDish.protein) /
          Number(
            meal.mainDish.qty +
              meal.mainDish.extra.protein +
              meal.mainDish.extra.carb
          );

        if (meal.mainDish.unit === 'GM') {
          meal.mainDish.extra = { carb: 0, protein: 0 };
          if (meal.mainDish.tag === 'c') {
            meal.mainDish.extra.carb = this.ExtraCarbOverAll;
          } else if (meal.mainDish.tag === 'p') {
            meal.mainDish.extra.protein = this.ExtraProteinOverAll;
          }
          else if (meal.mainDish.tag === 'cp'){
            meal.mainDish.extra.protein = this.ExtraProteinOverAll;
            meal.mainDish.extra.carb = this.ExtraCarbOverAll;
          }
        }else{
          meal.mainDish.extra = { carb: 0, protein: 0 };
          if (meal.mainDish.tag === 'c') {
            meal.mainDish.extra.carb = this.ExtraCarbOverAll/50;
          } else if (meal.mainDish.tag === 'p') {
            meal.mainDish.extra.protein = this.ExtraProteinOverAll/50;
          }
          else if (meal.mainDish.tag === 'cp'){
            meal.mainDish.extra.protein = this.ExtraProteinOverAll/50;
            meal.mainDish.extra.carb = this.ExtraCarbOverAll/50;
          }
        }

        // Check if there are side dishes and they have unit "GM"
        if (meal.sideDish && meal.sideDish.length > 0) {
          for (const sideDish of meal.sideDish) {

            const percentage11 =
            Number(sideDish.calories) /
            Number(
              sideDish.qty + sideDish.extra.protein + sideDish.extra.carb
            );
          const percentage22 =
            Number(sideDish.fat) /
            Number(
              sideDish.qty + sideDish.extra.protein + sideDish.extra.carb
            );
          const percentage33 =
            Number(sideDish.carb) /
            Number(
              sideDish.qty + sideDish.extra.protein + sideDish.extra.carb
            );
          const percentage44 =
            Number(sideDish.protein) /
            Number(
              sideDish.qty + sideDish.extra.protein + sideDish.extra.carb
            );

            if (sideDish.unit === 'GM') {

              // Reset the "extra" object for the side dish
              sideDish.extra = { carb: 0, protein: 0 };

              // Check the tag and update the "extra" object accordingly for the side dish
              if (sideDish.tag === 'c') {
                sideDish.extra.carb = this.ExtraCarbOverAll;
              } else if (sideDish.tag === 'p') {
                sideDish.extra.protein = this.ExtraProteinOverAll;
              }
              else if (meal.mainDish.tag === 'cp'){
                sideDish.extra.protein = this.ExtraProteinOverAll;
                sideDish.extra.carb = this.ExtraCarbOverAll;
              }
     
            }
            else{
              if (sideDish.tag === 'c') {
                sideDish.extra.carb = this.ExtraCarbOverAll/50;
              } else if (sideDish.tag === 'p') {
                sideDish.extra.protein = this.ExtraProteinOverAll/50;
              }
              else if (meal.mainDish.tag === 'cp'){
                sideDish.extra.protein = this.ExtraProteinOverAll/50;
                sideDish.extra.carb = this.ExtraCarbOverAll/50;
              }
            }

            sideDish.calories =
            Number(percentage11 || 0) *
            Number(
              sideDish.qty + sideDish.extra.carb + sideDish.extra.protein
            );
          sideDish.fat =
            Number(percentage22 || 0) *
            Number(
              sideDish.qty + sideDish.extra.carb + sideDish.extra.protein
            );
          sideDish.carb =
            Number(percentage33 || 0) *
            Number(
              sideDish.qty + sideDish.extra.carb + sideDish.extra.protein
            );
          sideDish.protein =
            Number(percentage44 || 0) *
            Number(
              sideDish.qty + sideDish.extra.carb + sideDish.extra.protein
            );
          }
        }

        meal.mainDish.calories =
        Number(percentage1 || 0) *
        Number(
          meal.mainDish.qty +
            meal.mainDish.extra.carb +
            meal.mainDish.extra.protein
        );
      meal.mainDish.fat =
        Number(percentage2 || 0) *
        Number(
          meal.mainDish.qty +
            meal.mainDish.extra.carb +
            meal.mainDish.extra.protein
        );
      meal.mainDish.carb =
        Number(percentage3 || 0) *
        Number(
          meal.mainDish.qty +
            meal.mainDish.extra.carb +
            meal.mainDish.extra.protein
        );
      meal.mainDish.protein =
        Number(percentage4 || 0) *
        Number(
          meal.mainDish.qty +
            meal.mainDish.extra.carb +
            meal.mainDish.extra.protein
        );
      }
    }

    this.userMeals = modifiedMeals;
    this.sumTotalExtra(this.userMeals);
  }



  sumTotalExtra(mealPlanData: IShowMealsResponse[]) {
    const meals_count = this.selected_program.subscription_days * this.selected_program.meal_types.length;
    const protein_price = this.program_extra_prices.protein
    const carb_price = this.program_extra_prices.carb
    const extra_protein_count = this.ExtraProteinOverAll / 50
    const extra_carb_count = this.ExtraCarbOverAll / 50

    const program_extra_protein_price = extra_protein_count * meals_count * protein_price
    const program_extra_carb_price = extra_carb_count * meals_count * carb_price
    this.price$ = this.price$.pipe(
      map((res) => {
        if (res) {
          const updatedPrice:INormalProgramPriceResponse = { ...res,
            global_extra_carb:program_extra_carb_price,global_extra_protein:program_extra_protein_price};
          return (res = updatedPrice);
        }
        return res;
      })
    );
  }
}




  // ======================================================== old logic ========================================================

  // calcExtra(meal: Meal, increase: boolean, type: 'p' | 'c') {
  //   const modifiedMeal: Meal = JSON.parse(JSON.stringify(meal));
  //   const mainDish: Dish = modifiedMeal.mainDish;

  //   const extraProperty = type === 'p' ? 'protein' : 'carb';
  //   const currentExtraValue = mainDish.extra[extraProperty];
  //   const newExtra = increase
  //     ? Math.min(currentExtraValue + mainDish.counter)
  //     : Math.max(currentExtraValue - mainDish.counter, 0);

  //   mainDish.extra[extraProperty] = newExtra;
  //   mainDish.qty = mainDish.defaultQty + this.sumExtra(mainDish.extra);
  //   mainDish.calories = this.calcNutrition(mainDish, meal, 'calories');
  //   mainDish.fat = this.calcNutrition(mainDish, meal, 'fat');
  //   mainDish.carb = this.calcNutrition(mainDish, meal, 'carb');
  //   mainDish.protein = this.calcNutrition(mainDish, meal, 'protein');
  //   modifiedMeal.mainDish = mainDish;
  //   this.currentMeal = modifiedMeal;
  // }

  // calcExtra2(meal: Meal, increase: boolean, type: 'p' | 'c', index: number) {
  //   const modifiedMeal: Meal = JSON.parse(JSON.stringify(meal));
  //   const extraProperty = type === 'p' ? 'protein' : 'carb';
  //   if (index >= 0 && index < modifiedMeal.sideDish.length) {
  //     const sideDish: Dish = modifiedMeal.sideDish[index];
  //     const currentExtraValue = sideDish.extra[extraProperty];

  //     const newExtra = increase
  //       ? Math.min(currentExtraValue + sideDish.counter)
  //       : Math.max(currentExtraValue - sideDish.counter, 0);
  //     sideDish.extra[extraProperty] = newExtra;
  //     sideDish.qty = sideDish.defaultQty + this.sumExtra(sideDish.extra);
  //     modifiedMeal.sideDish.forEach((e, i) => {
  //       e.calories = this.calcNutrition2(e, modifiedMeal, 'calories', i);
  //       e.fat = this.calcNutrition2(e, modifiedMeal, 'fat', i);
  //       e.carb = this.calcNutrition2(e, modifiedMeal, 'carb', i);
  //       e.protein = this.calcNutrition2(e, modifiedMeal, 'protein', i);
  //     });
  //     modifiedMeal.sideDish[index] = sideDish;
  //     this.currentMeal = modifiedMeal;
  //   }
  // }

  // sumExtra(extra: any) {
  //   let total = 0;
  //   for (const key in extra) {
  //     if (extra.hasOwnProperty(key)) {
  //       total += extra[key];
  //     }
  //   }
  //   return total;
  // }


  // changeMainDishNutrition(meal: Meal, increase: boolean) {
  //   if (meal.mainDish.tag) {
  //     // const modifiedMeal: Meal = { ...meal };
  //     const modifiedMeal: Meal = JSON.parse(JSON.stringify(meal));
  //     const mainDish: Dish = modifiedMeal.mainDish;
  //     const newQty = increase
  //       ? Math.min(mainDish.qty + mainDish.counter)
  //       : Math.max(mainDish.qty - mainDish.counter, mainDish.min_qty);
  //     mainDish.qty = newQty;
  //     mainDish.tag == 'p'
  //       ? (mainDish.extra.protein =
  //           mainDish.qty - mainDish.defaultQty > 0
  //             ? mainDish.qty - mainDish.defaultQty
  //             : 0)
  //       : (mainDish.extra.carb =
  //           mainDish.qty - mainDish.defaultQty > 0
  //             ? mainDish.qty - mainDish.defaultQty
  //             : 0);
  //     mainDish.calories = this.calcNutrition(mainDish, meal, 'calories');
  //     mainDish.fat = this.calcNutrition(mainDish, meal, 'fat');
  //     mainDish.carb = this.calcNutrition(mainDish, meal, 'carb');
  //     mainDish.protein = this.calcNutrition(mainDish, meal, 'protein');
  //     modifiedMeal.mainDish = mainDish;
  //     this.currentMeal = modifiedMeal;
  //   }
  // }

  // changeSideDishNutrition(meal: Meal, increase: boolean, index: number) {
  //   if (meal.sideDish[index].tag) {
  //     // Clone the entire meal object to ensure mutability
  //     const modifiedMeal: Meal = JSON.parse(JSON.stringify(meal));

  //     // Ensure that the specified index is within the bounds of the sideDish array
  //     if (index >= 0 && index < modifiedMeal.sideDish.length) {
  //       const sideDish: Dish = modifiedMeal.sideDish[index];
  //       const newQty = increase
  //         ? Math.min(sideDish.qty + sideDish.counter)
  //         : Math.max(sideDish.qty - sideDish.counter, sideDish.min_qty);

  //       // Update the quantity for the specific side dish
  //       sideDish.qty = newQty;
  //       sideDish.tag == 'p'
  //         ? (sideDish.extra.protein =
  //             sideDish.qty - sideDish.defaultQty > 0
  //               ? sideDish.qty - sideDish.defaultQty
  //               : 0)
  //         : (sideDish.extra.carb =
  //             sideDish.qty - sideDish.defaultQty > 0
  //               ? sideDish.qty - sideDish.defaultQty
  //               : 0);

  //       // Recalculate nutrition information for all side dishes
  //       modifiedMeal.sideDish.forEach((e, i) => {
  //         e.calories = this.calcNutrition2(e, modifiedMeal, 'calories', i);
  //         e.fat = this.calcNutrition2(e, modifiedMeal, 'fat', i);
  //         e.carb = this.calcNutrition2(e, modifiedMeal, 'carb', i);
  //         e.protein = this.calcNutrition2(e, modifiedMeal, 'protein', i);
  //       });
  //       this.currentMeal = modifiedMeal;
  //     }
  //   }
  // }


  // sumTotalExtra(mealPlanData: IShowMealsResponse[]) {
  //   let totalExtraProteinCost = 0;
  //   let totalExtraCarbCost = 0;

  //   // Iterate through each day's meals
  //   for (const day of mealPlanData) {
  //     for (const meal of day.meals) {
  //       // Check if there is an "extra" object for the main dish
  //       if (meal.mainDish.extra) {
  //         const extraProtein = meal.mainDish.extra.protein || 0; // Get extra protein (default to 0 if not present)
  //         const extraCarb = meal.mainDish.extra.carb || 0; // Get extra carb (default to 0 if not present)

  //         if (meal.mainDish.unit.toLowerCase() == 'gm') {
  //           // Calculate the cost based on pricing rules
  //         totalExtraProteinCost += (extraProtein / 50) * this.program_extra_prices.protein; // $6 for every 50 grams of extra protein
  //         totalExtraCarbCost += (extraCarb / 50) * this.program_extra_prices.carb; // $2 for every 50 grams of extra carb
  //         } else {
  //           // Calculate the cost based on pricing rules
  //         totalExtraProteinCost += (extraProtein / 1) * this.program_extra_prices.protein; // $6 for every 50 grams of extra protein
  //         totalExtraCarbCost += (extraCarb / 1) * this.program_extra_prices.carb; // $2 for every 50 grams of extra carb
  //         }
  //       }
  //       // Check if there are side dishes
  //       if (meal.sideDish && meal.sideDish.length > 0) {
  //         for (const sideDish of meal.sideDish) {
  //           if (sideDish.extra) {
  //             const extraProtein = sideDish.extra.protein || 0; // Get extra protein (default to 0 if not present)
  //             const extraCarb = sideDish.extra.carb || 0; // Get extra carb (default to 0 if not present)

  //             if (sideDish.unit.toLowerCase() == 'gm') {
  //                  // Calculate the cost based on pricing rules for side dishes
  //             totalExtraProteinCost += (extraProtein / 50) * this.program_extra_prices.protein; // $6 for every 50 grams of extra protein
  //             totalExtraCarbCost += (extraCarb / 50) * this.program_extra_prices.carb; // $2 for every 50 grams of extra carb
  //             } else {
  //                  // Calculate the cost based on pricing rules for side dishes
  //             totalExtraProteinCost += (extraProtein / 1) * this.program_extra_prices.protein; // $6 for every 50 grams of extra protein
  //             totalExtraCarbCost += (extraCarb / 1) * this.program_extra_prices.carb; // $2 for every 50 grams of extra carb
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }

  //   this.price$ = this.price$.pipe(
  //     map((res) => {
  //       if (res) {
  //         const extraDetails: Extra = {
  //           protein: {
  //             ...res.extra_details.protein,
  //             total_price: totalExtraProteinCost,
  //           },
  //           carb: {
  //             ...res.extra_details.carb,
  //             total_price: totalExtraCarbCost,
  //           },
  //         };
  //         const updatedPrice = { ...res, extra_details: extraDetails };
  //         return (res = updatedPrice);
  //       }
  //       return res;
  //     })
  //   );
  // }



    // calcExtraGramOverAll(increase: boolean) {
  //   const hasMealWithTagP = this.userMeals.some((mealPlan) => {
  //     return mealPlan.meals.some((meal) => {
  //       const mainDish = meal.mainDish || {};
  //       const tag = mainDish.tag || '';
  //       return tag === 'p';
  //     });
  //   });

  //   if (hasMealWithTagP) {
  //     this.ExtraProteinOverAll = increase
  //       ? Math.min(this.ExtraProteinOverAll + 50)
  //       : Math.max(this.ExtraProteinOverAll - 50, 0);
  //     this.addExtraGramsToMeals();
  //   } else {
  //     this._MessageService.clear();
  //     this._MessageService.add({
  //       severity: 'warn',
  //       summary:
  //         this.translate.currentLang == 'ar'
  //           ? 'لا يمكنك الأضافة'
  //           : 'You cannot add',
  //       detail:
  //         this.translate.currentLang == 'ar'
  //           ? 'لا يوجد لديك وجبة تصنيفها بروتين في خطتك'
  //           : `you don't have meal labeled as protein in your plan`,
  //       life: 3000,
  //     });
  //   }
  // }

    // calcExtraPieceOverAll(increase: boolean) {
  //   const hasMealWithTagC = this.userMeals.some((mealPlan) => {
  //     return mealPlan.meals.some((meal) => {
  //       const mainDish = meal.mainDish || {};
  //       const tag = mainDish.tag || '';
  //       return tag === 'c';
  //     });
  //   });
  //   if (hasMealWithTagC) {
  //     this.ExtraCarbOverAll = increase
  //       ? Math.min(this.ExtraCarbOverAll + 50)
  //       : Math.max(this.ExtraCarbOverAll - 50, 0);
  //     this.addExtraGramsToMeals();
  //   } else {
  //     this._MessageService.clear();
  //     this._MessageService.add({
  //       severity: 'warn',
  //       summary:
  //         this.translate.currentLang == 'ar'
  //           ? 'لا يمكنك الأضافة'
  //           : 'You cannot add',
  //       detail:
  //         this.translate.currentLang == 'ar'
  //           ? 'لا يوجد لديك وجبة تصنيفها كارب في خطتك'
  //           : `you don't have meal labeled as carb in your plan`,
  //       life: 3000,
  //     });
  //   }
  // }