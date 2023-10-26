import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, of, map } from 'rxjs';
import * as fromNormalPlanSelector from 'src/app/store/normalPlanStore/normalPlan.selector';
import { SharedService } from 'src/app/services/shared.service';
import {
  Dish,
  INormalPlanResponse,
  INormalProgramPriceResponse,
  IReplacement,
  IShowMealsResponse,
  ISubscriptionData,
  Meal,
} from 'src/app/interfaces/normal-plan.interface';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {
  FETCH_NORMALPLAN_PRICE_START,
  SAVE_NORMAL_MEALS,
  FETCH_REPLACE_MEAL_START,
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
  userMealsClone: IShowMealsResponse[] = [];
  ProgramDetails!: Observable<INormalPlanResponse | null>;
  nextButtonMode$: Observable<boolean | null> = of(false);
  ReplacementButtonMode$: Observable<boolean | null> = of(false);
  mealDetailsModal: boolean = false;
  mealDetailsModal1: boolean = false;
  replacementModal: boolean = false;
  carouselVisible: boolean = true;
  sidebarOptions: boolean = false;
  showNutritionSummary: boolean = false;
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
  program_id: number = 0;
  price$: Observable<INormalProgramPriceResponse | null> = of(null);
  replacementMeals: IReplacement[] = [];
  program_extra_prices: { carb: number; protein: number } = {
    carb: 0,
    protein: 0,
  };
  selected_program!: ISubscriptionData;
  @ViewChild('replaced_items') replaced_items!: ElementRef;

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
          this.userMealsClone = res;
          this.price$ = _Store.select(
            fromNormalPlanSelector.normalPlanPriceSelector
          );

          this.ProgramDetails = _Store.select(
            fromNormalPlanSelector.normalPlanSelector
          );
          this.ProgramDetails.pipe(takeUntil(this.destroyed$)).subscribe(
            (res) => {
              if (res) {
                this.program_id = res.id;
                this.program_extra_prices = res.extra_prices;
              } else {
                this.program_extra_prices = { carb: 2, protein: 6 };
              }
            }
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
          this.selected_program = res;
        }
      });

    this.ExtraProteinOverAll =
      this._SharedService.global_extra_protein.value || 0;
    this.ExtraCarbOverAll = this._SharedService.global_extra_carb.value || 0;
    this.sumTotalExtra();
  }

  ngOnInit(): void {}

  toggleCategories(e: Event, index: number) {
    this.category_index = index;
    this._SharedService.toggleCategories(e);
  }

  toggleItems(index:number,replaced_item: Meal) {
    for (let i = 0; i < this.replaced_items.nativeElement.children.length; i++) {
      this.replaced_items.nativeElement.children[i].children[0].children[0].classList.remove('active');
      this.replaced_items.nativeElement.children[index].children[0].children[0].classList.add('active');
    }
    this.replaceMeal(replaced_item)
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
          this._SharedService.global_extra_carb.next(this.ExtraCarbOverAll);
          this._SharedService.global_extra_protein.next(
            this.ExtraProteinOverAll
          );
          this._Store.dispatch(SAVE_NORMAL_MEALS({ data: this.userMeals }));
          this.getPrice(res);
        }
      });
  }

  getPrice(res: ISubscriptionData) {
    this._Store.dispatch(
      FETCH_NORMALPLAN_PRICE_START({
        data: {
          subscription_day_count: res.subscription_days,
          meal_count: res.meals.length,
          program_id: res.program_id,
          snack_count: res.snacks.length,
          list_days: this.userMeals,
          global_extra_carb: this.ExtraCarbOverAll,
          global_extra_protein: this.ExtraProteinOverAll,
          include_breakfast: res.meal_types.includes('breakfast'),
        },
      })
    );
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  openDetails(meal: Meal, index: number) {
    this.currentMealIndex = index;
    this.currentMeal = meal;
    // this.mealDetailsModal1 = true;
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
      const allMeals: IShowMealsResponse[] = JSON.parse(
        JSON.stringify(this.userMeals)
      );
      allMeals[this.category_index].meals[this.currentMealIndex] =
        this.currentMeal;
      this.userMeals = allMeals;
      this.sumTotalExtra();
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
      const allMeals: IShowMealsResponse[] = JSON.parse(
        JSON.stringify(this.userMeals)
      );
      allMeals[this.category_index].meals[this.currentMealIndex] =
        this.currentMeal;
      this.userMeals = allMeals;
      this.sumTotalExtra();
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
      ? Math.min(this.ExtraProteinOverAll + 50)
      : Math.max(this.ExtraProteinOverAll - 50, -50);
    this.addExtraGramsToMeals();
  }

  calcExtraPieceOverAll(increase: boolean) {
    this.ExtraCarbOverAll = increase
      ? Math.min(this.ExtraCarbOverAll + 50)
      : Math.max(this.ExtraCarbOverAll - 50, -50);
    this.addExtraGramsToMeals();
  }

  addExtraGramsToMeals(meals: IShowMealsResponse[] = this.userMeals) {
    const modifiedMeals: IShowMealsResponse[] = JSON.parse(
      JSON.stringify(meals)
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

        if (
          meal.mainDish.meal_type != 'breakfast' &&
          meal.mainDish.meal_type != 'snack_one' &&
          meal.mainDish.meal_type != 'snack_two'
        ) {
          if (meal.mainDish.unit === 'GM') {
            meal.mainDish.extra = { carb: 0, protein: 0 };
            if (meal.mainDish.tag === 'c') {
              if (
                this.ExtraCarbOverAll + meal.mainDish.defaultQty >=
                meal.mainDish.min_qty
              ) {
                meal.mainDish.extra.carb = this.ExtraCarbOverAll;
              }
              // if (this.ExtraCarbOverAll >= 0) {
              //   meal.mainDish.extra.carb = this.ExtraCarbOverAll;
              // } else {
              //   if (meal.mainDish.defaultQty > meal.mainDish.min_qty) {
              //     meal.mainDish.extra.carb = this.ExtraCarbOverAll;
              //   }
              // }
              // meal.mainDish.extra.carb = this.ExtraCarbOverAll;
            } else if (meal.mainDish.tag === 'p') {
              if (
                this.ExtraProteinOverAll + meal.mainDish.defaultQty >=
                meal.mainDish.min_qty
              ) {
                meal.mainDish.extra.protein = this.ExtraProteinOverAll;
              }
              // if (this.ExtraProteinOverAll >= 0) {
              //   meal.mainDish.extra.protein = this.ExtraProteinOverAll;
              // } else {
              //   if (meal.mainDish.defaultQty > meal.mainDish.min_qty) {
              //     meal.mainDish.extra.protein = this.ExtraProteinOverAll;
              //   }
              // }
              // meal.mainDish.extra.protein = this.ExtraProteinOverAll;
            } else if (meal.mainDish.tag === 'cp') {
              if (
                this.ExtraProteinOverAll +
                  this.ExtraCarbOverAll +
                  meal.mainDish.defaultQty >=
                meal.mainDish.min_qty
              ) {
                meal.mainDish.extra.protein = this.ExtraProteinOverAll;
                meal.mainDish.extra.carb = this.ExtraCarbOverAll;
              }

              // if (this.ExtraCarbOverAll >= 0) {
              //   meal.mainDish.extra.carb = this.ExtraCarbOverAll;
              // } else {
              //   if (meal.mainDish.defaultQty >= Number(meal.mainDish.min_qty)+100) {
              //     meal.mainDish.extra.carb = this.ExtraCarbOverAll;
              //   }
              // }

              // if (this.ExtraProteinOverAll >= 0) {
              //   meal.mainDish.extra.protein = this.ExtraProteinOverAll;
              // } else {
              //   if (meal.mainDish.defaultQty >= Number(meal.mainDish.min_qty)+100) {
              //     meal.mainDish.extra.protein = this.ExtraProteinOverAll;
              //   }
              // }
            }
          }
        }

        // else{
        // meal.mainDish.extra = { carb: 0, protein: 0 };
        // if (meal.mainDish.tag === 'c') {
        //   meal.mainDish.extra.carb = this.ExtraCarbOverAll/50;
        // } else if (meal.mainDish.tag === 'p') {
        //   meal.mainDish.extra.protein = this.ExtraProteinOverAll/50;
        // }
        // else if (meal.mainDish.tag === 'cp'){
        //   meal.mainDish.extra.protein = this.ExtraProteinOverAll/50;
        //   meal.mainDish.extra.carb = this.ExtraCarbOverAll/50;
        // }
        // }

        // Check if there are side dishes and they have unit "GM"
        if (meal.sideDish && meal.sideDish.length > 0) {
          for (const sideDish of meal.sideDish) {
            if (
              sideDish.meal_type != 'breakfast' &&
              sideDish.meal_type != 'snack_one' &&
              sideDish.meal_type != 'snack_two'
            ) {
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
                  if (
                    this.ExtraCarbOverAll + sideDish.defaultQty >=
                    sideDish.min_qty
                  ) {
                    sideDish.extra.carb = this.ExtraCarbOverAll;
                  }
                } else if (sideDish.tag === 'p') {
                  if (
                    this.ExtraProteinOverAll + sideDish.defaultQty >=
                    sideDish.min_qty
                  ) {
                    sideDish.extra.protein = this.ExtraProteinOverAll;
                  }
                } else if (sideDish.tag === 'cp') {
                  if (
                    this.ExtraProteinOverAll +
                      this.ExtraCarbOverAll +
                      sideDish.defaultQty >=
                    sideDish.min_qty
                  ) {
                    sideDish.extra.protein = this.ExtraProteinOverAll;
                    sideDish.extra.carb = this.ExtraCarbOverAll;
                  }
                }
              }
              // else{
              // if (sideDish.tag === 'c') {
              //   sideDish.extra.carb = this.ExtraCarbOverAll/50;
              // } else if (sideDish.tag === 'p') {
              //   sideDish.extra.protein = this.ExtraProteinOverAll/50;
              // }
              // else if (meal.mainDish.tag === 'cp'){
              //   sideDish.extra.protein = this.ExtraProteinOverAll/50;
              //   sideDish.extra.carb = this.ExtraCarbOverAll/50;
              // }
              // }

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
    this.sumTotalExtra();
  }

  sumTotalExtra() {
    const excludedMealTypes = ['breakfast', 'snack_one', 'snack_two'];
    const filteredMealTypes = this.selected_program.meal_types.filter(
      (type) => !excludedMealTypes.includes(type)
    );
    const meals_count =
      filteredMealTypes.length * this.selected_program.subscription_days;

    const protein_price = this.program_extra_prices.protein;
    const carb_price = this.program_extra_prices.carb;
    const extra_protein_count = this.ExtraProteinOverAll / 50;
    const extra_carb_count = this.ExtraCarbOverAll / 50;

    const program_extra_protein_price =
      extra_protein_count * meals_count * protein_price;
    const program_extra_carb_price =
      extra_carb_count * meals_count * carb_price;
    this.price$ = this.price$.pipe(
      map((res) => {
        if (res) {
          const updatedPrice: INormalProgramPriceResponse = {
            ...res,
            global_extra_carb: program_extra_carb_price,
            global_extra_protein: program_extra_protein_price,
          };
          return (res = updatedPrice);
        }
        return res;
      })
    );
  }

  check_meal_types(): boolean {
    const mealTypes = this.selected_program.meal_types;

    // Check Condition 1: Length is 3, and it contains "breakfast," "snack_one," and "snack_two"
    const isCondition1Met =
      mealTypes.length === 3 &&
      mealTypes.includes('breakfast') &&
      mealTypes.includes('snack_one') &&
      mealTypes.includes('snack_two');

    // Check Condition 2: Length is 2, and it contains "breakfast" and one of "snack_one" or "snack_two"
    const isCondition2Met =
      mealTypes.length === 2 &&
      mealTypes.includes('breakfast') &&
      (mealTypes.includes('snack_one') || mealTypes.includes('snack_two'));

    // Check Condition 3: Length is 1, and it contains "breakfast"
    const isCondition3Met =
      mealTypes.length === 1 && mealTypes[0] === 'breakfast';

    if (isCondition1Met || isCondition2Met || isCondition3Met) {
      this.ExtraCarbOverAll = 0;
      this.ExtraProteinOverAll = 0;
    }
    // Return true if any of the conditions are met
    return isCondition1Met || isCondition2Met || isCondition3Met;
  }

  replaced_item_index: number = 0;
  getReplacementMeals(item:Dish, index:number) {
  const destroyed$: Subject<void> = new Subject();

    this.replaced_item_index = index;
    this.ReplacementButtonMode$ = this._Store.select(
      fromNormalPlanSelector.normalPlanReplacementLoadingSelector
    );
    this._Store.dispatch(
      FETCH_REPLACE_MEAL_START({
        data: {
          dish_type: 'meal',
          item: item.is_replaced ? item.old_name:item.meal_name,
          date: this.userMeals[this.category_index].date,
          meal_type:item.meal_type,
          program_id: this.program_id,
        },
      })
    );

    this._Store
      .select(fromNormalPlanSelector.normalPlanReplacementSelector)
      .pipe(takeUntil(destroyed$))
      .subscribe((res) => {
        if (res) {
          if (item.is_replaced) {
            let modifiedMeals: Meal[] = JSON.parse(
              JSON.stringify(res)
            );
            modifiedMeals = modifiedMeals.filter(e => e.mainDish.meal_name_en != item.meal_name_en)
            modifiedMeals.push(this.userMealsClone[this.category_index].meals[index])
            res = modifiedMeals
          }
          let modifiedMeals: Meal[] = JSON.parse(JSON.stringify(res));
          modifiedMeals = this.calcReplacementMeals(modifiedMeals)
          res = modifiedMeals
          this.replacementModal = true;
          this.replacementMeals = res;
          destroyed$.next();
          destroyed$.complete();
        }
      });
  }

  replaceMeal(replaced_item: Meal) {
    let modifiedMeals: IShowMealsResponse[] = JSON.parse(
      JSON.stringify(this.userMeals)
    );
    replaced_item.mainDish.old_name = this.userMealsClone[this.category_index].meals[this.replaced_item_index].mainDish.meal_name
    modifiedMeals[this.category_index].meals[this.replaced_item_index] = replaced_item
    this.userMeals = modifiedMeals;
    this.addExtraGramsToMeals();
  }

  resetMeal(index:number) {
    let modifiedMeals: IShowMealsResponse[] = JSON.parse(
      JSON.stringify(this.userMeals)
    );
    modifiedMeals[this.category_index].meals[index] = this.userMealsClone[this.category_index].meals[index];
    this.userMeals = modifiedMeals;
    this.addExtraGramsToMeals();
  }

  calcReplacementMeals(meals: Meal[]) {
    for (const meal of meals) {
      meal.mainDish.extra = { carb: 0, protein: 0 };
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

      if (
        meal.mainDish.meal_type != 'breakfast' &&
        meal.mainDish.meal_type != 'snack_one' &&
        meal.mainDish.meal_type != 'snack_two'
      ) {
        if (meal.mainDish.unit === 'GM') {
          meal.mainDish.extra = { carb: 0, protein: 0 };
          if (meal.mainDish.tag === 'c') {
            if (
              this.ExtraCarbOverAll + meal.mainDish.defaultQty >=
              meal.mainDish.min_qty
            ) {
              meal.mainDish.extra.carb = this.ExtraCarbOverAll;
            }
          } else if (meal.mainDish.tag === 'p') {
            if (
              this.ExtraProteinOverAll + meal.mainDish.defaultQty >=
              meal.mainDish.min_qty
            ) {
              meal.mainDish.extra.protein = this.ExtraProteinOverAll;
            }
          } else if (meal.mainDish.tag === 'cp') {
            if (
              this.ExtraProteinOverAll +
                this.ExtraCarbOverAll +
                meal.mainDish.defaultQty >=
              meal.mainDish.min_qty
            ) {
              meal.mainDish.extra.protein = this.ExtraProteinOverAll;
              meal.mainDish.extra.carb = this.ExtraCarbOverAll;
            }
          }
        }

        if (meal.sideDish && meal.sideDish.length > 0) {
          for (const sideDish of meal.sideDish) {
            if (
              sideDish.meal_type != 'breakfast' &&
              sideDish.meal_type != 'snack_one' &&
              sideDish.meal_type != 'snack_two'
            ) {
              sideDish.extra = { carb: 0, protein: 0 };
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
                sideDish.extra = { carb: 0, protein: 0 };
                if (sideDish.tag === 'c') {
                  if (
                    this.ExtraCarbOverAll + sideDish.defaultQty >=
                    sideDish.min_qty
                  ) {
                    sideDish.extra.carb = this.ExtraCarbOverAll;
                  }
                } else if (sideDish.tag === 'p') {
                  if (
                    this.ExtraProteinOverAll + sideDish.defaultQty >=
                    sideDish.min_qty
                  ) {
                    sideDish.extra.protein = this.ExtraProteinOverAll;
                  }
                } else if (sideDish.tag === 'cp') {
                  if (
                    this.ExtraProteinOverAll +
                      this.ExtraCarbOverAll +
                      sideDish.defaultQty >=
                    sideDish.min_qty
                  ) {
                    sideDish.extra.protein = this.ExtraProteinOverAll;
                    sideDish.extra.carb = this.ExtraCarbOverAll;
                  }
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
      else{
        if (meal.sideDish && meal.sideDish.length > 0) {
          for (const sideDish of meal.sideDish) {
            sideDish.extra = { carb: 0, protein: 0 };
          }
        }
      }


    }

    return meals
  }

  round(num:number): number {
    return Math.round(num);
  }
}
