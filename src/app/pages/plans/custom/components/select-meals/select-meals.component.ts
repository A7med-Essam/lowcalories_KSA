import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MessageService } from 'primeng/api';
import { Observable, takeUntil, Subject } from 'rxjs';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import {
  ICategoriesResponse,
  ICustomMealsResponse,
  ICustomPlanResponse,
  ISubscriptionData,
  ICards,
  IDish,
} from 'src/app/interfaces/custom-plan.interface';
import { SharedService } from 'src/app/services/shared.service';
import { SAVE_CUSTOMPLAN_CARDS } from 'src/app/store/customPlanStore/customPlan.action';
import {
  customPlanSelector,
  CustomSubscriptionSelector,
  showCategoriesSelector,
  showMealsSelector,
} from 'src/app/store/customPlanStore/customPlan.selector';

@Component({
  selector: 'app-select-meals',
  templateUrl: './select-meals.component.html',
  styleUrls: ['./select-meals.component.scss'],
  providers: [MessageService],
})
export class SelectMealsComponent implements OnDestroy {
  private destroyed$: Subject<void> = new Subject();
  category_index: number = 0;
  meals$!: Observable<ICustomMealsResponse[] | null>;
  ProgramDetails!: Observable<ICustomPlanResponse[] | null>;
  categories$!: Observable<ICategoriesResponse[] | null>;
  meals: ICustomMealsResponse[] = [];
  cards: ICards[] = [];
  mealDetailsModal: boolean = false;
  selectedMealModal: boolean = false;
  cardsStatus: boolean = false;
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
  mealDetails!: ICustomMealsResponse;
  carouselVisible:boolean = true;
  // slider meals
  customOptions: OwlOptions = {
    loop: false,
    autoplay: false,
    margin: 10,
    items: 1,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      768: {
        items: 3,
      },
    },
  };
  constructor(
    private _Store: Store,
    private _SharedService: SharedService,
    private _Router: Router,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _I18nService: I18nService,
    public translate: TranslateService,
  ) {
    this._I18nService.getCurrentLang(this.translate);
    this.meals$ = this._Store.select(showMealsSelector);
    this.categories$ = this._Store.select(showCategoriesSelector);
    this.ProgramDetails = this._Store.select(customPlanSelector);
    _Store
      .select(CustomSubscriptionSelector)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        res && (this.cards = this.getCards(res));
      });

    _Store
      .select(showCategoriesSelector)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res) {
          this.getMeals(res[0].id);
        }
      });

    _Store
      .select(showMealsSelector)
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
        this.customOptions.rtl = true;
      }
      this.translate.onLangChange.pipe(takeUntil(this.destroyed$)).subscribe(res=>{
        if (res.lang == 'ar') {
          this.categoryOptions.rtl = true;
          this.customOptions.rtl = true;
        }else{
          this.categoryOptions.rtl = false;
          this.customOptions.rtl = false;
        }
        this.carouselVisible = false;
  
        setTimeout(() => {
          this.carouselVisible = true;
        });
    
      })
  }

  toggleCategories(e: Event, index: number, id: number) {
    this.category_index = index;
    this._SharedService.toggleCategories(e);
    this.getMeals(id);
  }

  getMeals(id: number) {
    this.meals$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      if (res) {
        this.meals = res.filter((e) => e?.category_id == id);
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  getCards(sub: ISubscriptionData) {
    const startDate = new Date(sub.start_date);
    const uppercaseDeliveryDays = sub.delivery_days.map((day) =>
      day.toUpperCase()
    );
    const cards: ICards[] = [];
    let currentDate = startDate;
    let counter = 0;
    while (cards.length < Number(sub.number_of_Days)) {
      counter++;
      const currentDay = currentDate.getDay();
      if (uppercaseDeliveryDays.includes(this.getDayName(currentDay))) {
        cards.push({
          date: currentDate.toISOString().split('T')[0],
          day: this.getDayName(currentDay),
          meals: sub.number_of_Meals,
          snacks: this.generateSnackArray(sub.number_of_Snacks),
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
      if (counter > 10000) {
        break;
      }
    }

    cards.forEach((obj) => {
      obj.meals = obj.meals.map((meal) => {
        return {
          name: meal,
          status: false,
          details: null,
        };
      });
    });

    return cards;
  }

  getDayName(dayIndex: number) {
    const daysOfWeek = [
      'SUNDAY',
      'MONDAY',
      'TUSEDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];
    return daysOfWeek[dayIndex];
  }

  generateSnackArray(snackCount: number) {
    const snackArray = [];
    for (let i = 1; i <= snackCount; i++) {
      snackArray.push({ name: `Snack ${i}`, status: false, details: null });
    }
    return snackArray;
  }

  openDetails(meal: ICustomMealsResponse) {
    this.mealDetails = meal;
    this.mealDetailsModal = true;
  }

  pickMeal(meal: ICustomMealsResponse) {
    const mealList = meal.type.toLowerCase().includes('snack')
      ? 'snacks'
      : 'meals';

    let found = false;
    let index = 0;

    while (!found && index < this.cards.length) {
      const element = this.cards[index];
      const mealIndex = element[mealList].findIndex(
        (item) => item.details === null
      );

      if (mealIndex !== -1) {
        element[mealList][mealIndex].details = meal;
        element[mealList][mealIndex].status = true;
        found = true;
        this._MessageService.clear();
        this._MessageService.add({
          severity: 'success',
          summary: this.translate.currentLang == 'ar'?'تمت إضافة الوجبة':'Meal Added',
          detail: this.translate.currentLang == 'ar'?`${meal.mainDish.name_ar} تمت إضافتها بنجاح`:`${meal.mainDish.name} has been added successfully`,
          life: 3000,
        });
      }
      index++;
    }

    this.checkValidation(this.cards);
  }

  checkValidation(arr: ICards[]) {
    this.cardsStatus = arr.every((element) => {
      const mealsStatus = element.meals.every((meal) => meal.status === true);
      const snacksStatus = element.snacks.every(
        (snack) => snack.status === true
      );
      return mealsStatus && snacksStatus;
    });
  }

  getNextStep() {
    if (this.cardsStatus) {
      this._Store.dispatch(SAVE_CUSTOMPLAN_CARDS({ data: this.cards }));
      this._Router.navigate(['show-meals'], {
        relativeTo: this._ActivatedRoute.parent,
      });
    }
  }

  currentMeal: any;
  displaySelectedMeal(meal: any) {
    if (meal.status) {
      this.currentMeal = meal;
      this.mealDetails = meal.details;
      this.selectedMealModal = true;
    }
  }

  deleteMeal() {
    if (this.currentMeal.status) {
      this.currentMeal.status = false;
      this.currentMeal.details = null;
      this.selectedMealModal = false;
      this.checkValidation(this.cards);
    }
  }

  // ================================================ nutration section ================================================

  changeMainDishNutrition(meal: ICustomMealsResponse, increase: boolean) {
    const [originalMeal] = this.meals.filter((obj) => obj.id === meal.id);
    const modifiedMeal: ICustomMealsResponse = { ...meal };
    const mainDish: IDish = { ...meal.mainDish };
    const increment = modifiedMeal.mainDish.unit === 'GM' ? 5 : 1;
    const newMaxMeal = increase
      ? Math.min(mainDish.max_meal + increment, originalMeal.mainDish.max_meal)
      : Math.max(mainDish.max_meal - increment, increment);

    mainDish.max_meal = newMaxMeal;
    mainDish.calories = this.changeCalories(mainDish, originalMeal, true);
    mainDish.fat = this.changeFat(mainDish, originalMeal, true);
    mainDish.carb = this.changeCarb(mainDish, originalMeal, true);
    mainDish.protein = this.changeProtein(mainDish, originalMeal, true);
    modifiedMeal.mainDish = mainDish;
    this.mealDetails = modifiedMeal;
  }

  changeSideDishNutrition(meal: ICustomMealsResponse, increase: boolean) {
    const [originalMeal] = this.meals.filter((obj) => obj.id === meal.id);
    const modifiedMeal: ICustomMealsResponse = { ...meal };
    const sideDish: IDish = { ...meal.sideDish };
    const increment = modifiedMeal.sideDish.unit === 'GM' ? 5 : 1;
    const newMaxSide = increase
      ? Math.min(sideDish.max_side + increment, originalMeal.sideDish.max_side)
      : Math.max(sideDish.max_side - increment, increment);
    sideDish.max_side = newMaxSide;
    sideDish.calories = this.changeCalories(sideDish, originalMeal, false);
    sideDish.fat = this.changeFat(sideDish, originalMeal, false);
    sideDish.carb = this.changeCarb(sideDish, originalMeal, false);
    sideDish.protein = this.changeProtein(sideDish, originalMeal, false);
    modifiedMeal.sideDish = sideDish;
    this.mealDetails = modifiedMeal;
  }

  changeCalories(
    meal: IDish,
    originalMeal: ICustomMealsResponse,
    isMainDish: boolean
  ) {
    const mainDish: IDish = { ...meal };
    const caloriesPercentage = isMainDish
      ? originalMeal.mainDish.calories / originalMeal.mainDish.max_meal
      : originalMeal.sideDish.calories / originalMeal.sideDish.max_side;
    return (
      caloriesPercentage * (isMainDish ? mainDish.max_meal : mainDish.max_side)
    );
  }

  changeFat(
    meal: IDish,
    originalMeal: ICustomMealsResponse,
    isMainDish: boolean
  ) {
    const mainDish: IDish = { ...meal };
    const fatPercentage = isMainDish
      ? originalMeal.mainDish.fat / originalMeal.mainDish.max_meal
      : originalMeal.sideDish.fat / originalMeal.sideDish.max_side;
    return (
      fatPercentage * (isMainDish ? mainDish.max_meal : mainDish.max_side)
    );
  }

  changeCarb(
    meal: IDish,
    originalMeal: ICustomMealsResponse,
    isMainDish: boolean
  ) {
    const mainDish: IDish = { ...meal };
    const carbPercentage = isMainDish
      ? originalMeal.mainDish.carb / originalMeal.mainDish.max_meal
      : originalMeal.sideDish.carb / originalMeal.sideDish.max_side;
    return (
      carbPercentage * (isMainDish ? mainDish.max_meal : mainDish.max_side)
    );
  }

  changeProtein(
    meal: IDish,
    originalMeal: ICustomMealsResponse,
    isMainDish: boolean
  ) {
    const mainDish: IDish = { ...meal };
    const proteinPercentage = isMainDish
      ? originalMeal.mainDish.protein / originalMeal.mainDish.max_meal
      : originalMeal.sideDish.protein / originalMeal.sideDish.max_side;
    return (
      proteinPercentage * (isMainDish ? mainDish.max_meal : mainDish.max_side)
    );
  }
}