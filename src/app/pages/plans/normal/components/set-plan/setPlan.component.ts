import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, of, Subject, takeUntil } from 'rxjs';
import {
  DeliveryDay,
  INormalPlanResponse,
  ISubscriptionData,
  MealType,
  SubscriptionDay,
} from 'src/app/interfaces/normal-plan.interface';
import {
  FETCH_NORMALPLAN_PRICE_START,
  FETCH_NORMALPLAN_START,
  FETCH_SHOWMEALS_START,
  SAVE_NORMAL_SUBSCRIPTION,
} from 'src/app/store/normalPlanStore/normalPlan.action';
import * as fromNormalPlanSelector from '../../../../../store/normalPlanStore/normalPlan.selector';
import { ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import Swal from 'sweetalert2';
import { ShepherdService } from 'angular-shepherd';

@Component({
  selector: 'app-setPlan',
  templateUrl: './setPlan.component.html',
  styleUrls: ['./setPlan.component.scss'],
})
export class SetPlanComponent
  implements OnInit, OnDestroy 
{
  private destroyed$: Subject<void> = new Subject();
  @ViewChild('AllWeek') AllWeek!: ElementRef;
  @ViewChild('deliveredDays') deliveredDays!: ElementRef;

  ksaDate!: Date;
  ProgramDetails!: Observable<INormalPlanResponse | null>;
  program_id: number = 0;
  ProgramDetailsForm: FormGroup = new FormGroup({});
  skeletonMode$: Observable<boolean | null> = of(false);
  nextButtonMode$: Observable<boolean | null> = of(false);
  tour: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private _FormBuilder: FormBuilder,
    private _Store: Store,
    private _SharedService: SharedService,
    private _ElementRef: ElementRef,
    private _I18nService: I18nService,
    public translate: TranslateService,
    private shepherdService: ShepherdService
  ) {
    this._I18nService.getCurrentLang(this.translate);
  }

  createTour(){
    this.shepherdService.defaultStepOptions = {
      cancelIcon: {
        enabled: true
      },
      classes: 'class-1 class-2',
      scrollTo: { behavior: 'smooth', block: 'center' }
    }
    this.shepherdService.modal = true;
    this.shepherdService.confirmCancel = false;
    this.shepherdService.addSteps([
      {
        title: 'Welcome',
        text: `follow me to build your plan`,
        // attachTo: {
        //   element: '.tour0',
        //   on: 'bottom'
        // },
        buttons: [
          {
            action() {
              return this.next();
            },
            text: 'Next'
          }
        ],
        id: 'creating'
      },
      {
        title: 'Number Of Days',
        text: `select how many days in your plan`,
        attachTo: {
          element: '.tour1',
          on: 'bottom'
        },
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
          },
          {
            action() {
              return this.next();
            },
            text: 'Next'
          }
        ],
        id: 'creating'
      },
      {
        title: 'Number Of Meals',
        text: `select how many meals in your plan`,
        attachTo: {
          element: '.tour2',
          on: 'bottom'
        },
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
          },
          {
            action() {
              return this.next();
            },
            text: 'Next'
          }
        ],
        id: 'creating'
      },
      {
        title: 'Include Breakfast',
        text: `you can remove breakfast if only you select 1 or more meals`,
        attachTo: {
          element: '.tour3',
          on: 'bottom'
        },
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
          },
          {
            action() {
              return this.next();
            },
            text: 'Next'
          }
        ],
        id: 'creating'
      },
      {
        title: 'Number Of Snacks',
        text: `select how many snacks in your plan`,
        attachTo: {
          element: '.tour4',
          on: 'bottom'
        },
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
          },
          {
            action() {
              return this.next();
            },
            text: 'Next'
          }
        ],
        id: 'creating'
      },
      {
        title: 'Start Date',
        text: `select plan date start`,
        attachTo: {
          element: '.tour5',
          on: 'bottom'
        },
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
          },
          {
            action() {
              return this.next();
            },
            text: 'Next'
          }
        ],
        id: 'creating'
      },
      {
        title: 'Delivery Days',
        text: `select plan delivery days`,
        attachTo: {
          element: '.tour6',
          on: 'bottom'
        },
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
          },
          {
            action() {
              return this.next();
            },
            text: 'Next'
          }
        ],
        id: 'creating'
      },
      {
        title: 'Confirm your plan',
        text: `go to next step`,
        attachTo: {
          element: '.tour7',
          on: 'bottom'
        },
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
          },
          {
            action() {
              return this.next();
            },
            text: 'Finish Tutorial'
          }
        ],
        id: 'creating'
      }
    ]);
    this.shepherdService.start();
  }

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((params) => {
      this.program_id = Number(params.get('id'));
      if (isNaN(this.program_id)) {
        this._Router.navigate(['../plans']);
      } else {
        this._Store.dispatch(
          FETCH_NORMALPLAN_START({ program_id: this.program_id })
        );
        this.createPlanForm();
        this.ProgramDetails = this._Store.select(
          fromNormalPlanSelector.normalPlanSelector
        );
        this.skeletonMode$ = this._Store.select(
          fromNormalPlanSelector.normalPlanLoadingSelector
        );
        this.nextButtonMode$ = this._Store.select(
          fromNormalPlanSelector.showMealsLoadingSelector
        );
        this.getProgramDetails();
        this.getKsaDate();
      }
    });

  }



  createPlanForm() {
    this.ProgramDetailsForm = this._FormBuilder.group({
      Start_Date: new FormControl(null, [Validators.required]),
      subscription_days: new FormControl(null, [Validators.required]),
      // meal_types: new FormArray([], [this.atLeastOneCheckedValidator()]),
      meal_types: new FormControl(null, [Validators.required]),
      snack_types: new FormArray([]),
      CheckDays: new FormControl(null),
      addBreakFast: new FormControl(null),
    });
    this.onMealsChange();
  }

  // atLeastOneCheckedValidator(): ValidatorFn {
  //   return (formArray: AbstractControl): { [key: string]: boolean } | null => {
  //     if (formArray && formArray instanceof FormArray) {
  //       const values = formArray.value as boolean[];
  //       const hasChecked = values.some((value) => value === true);

  //       return hasChecked ? null : { atLeastOneChecked: true };
  //     }

  //     return null;
  //   };
  // }

  onSelectedDate(SelectedDate: Date, deliveredDays: HTMLElement) {
    this._SharedService.onSelectedDate(SelectedDate, deliveredDays);
  }

  meal_types: MealType[] = [];
  meal_count:string[] = [];
  snack_types: MealType[] = [];
  subscription_days: SubscriptionDay[] = [];
  delivery_days: DeliveryDay[] = [];
  meals:any[] = []
  getProgramDetails() {
    this.ProgramDetails.pipe(takeUntil(this.destroyed$))
    .pipe(
      map(res=>{
        if (res) {
          let modifiedDays: SubscriptionDay[] = JSON.parse(
            JSON.stringify(res.subscription_days)
          );
          modifiedDays.forEach(e => {
            e.displayName = e.day_count + ' Days'
            e.displayName_ar = e.day_count + ' أيام'
            return e
          })
          const updatedObject = {
            ...res,
            subscription_days: modifiedDays
          };
          res = updatedObject;
        }
        return res
      })
    )
    .subscribe((res) => {
      if (res) {
        this.delivery_days = res.delivery_days.filter(
          (day) => day.closed !== 1
        );
        this.subscription_days = res.subscription_days;
        this.ProgramDetailsForm.get('subscription_days')?.setValue(
          res.subscription_days[0].day_count
        );
        this.meal_types = res.meal_types;
        this.meals = this.getMealTypesCount(res.meal_types.length -1)
        this.translate.onLangChange
        .pipe(takeUntil(this.destroyed$))
        .subscribe(lang=>{
          this.meals = this.getMealTypesCount(res.meal_types.length -1)
        })
        this.snack_types = res.snack_types;
        this.snack_types.forEach(() => {
          (this.ProgramDetailsForm.get('snack_types') as FormArray).push(
            new FormControl(false)
          );
        });
        this.setDefaultDate();
        setTimeout(() => {
          this.createTour();
        }, 1);
      }
    });
  }

  getKsaDate() {
    this.ksaDate = this._SharedService.getKsaTime();
  }

  setDefaultDate() {
    setTimeout(() => {
      let DefaultDate: Date = this.ksaDate;
      if (DefaultDate.getDay() === 5) {
        DefaultDate.setDate(DefaultDate.getDate() + 1);
      }
      let firstDate = DefaultDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      this.ProgramDetailsForm.get('Start_Date')?.setValue(new Date(firstDate));
      const DeliveredDays: HTMLElement[] =
        this._ElementRef.nativeElement.querySelectorAll('.deliveredDays');
        this._SharedService.onSelectedDate(new Date(firstDate), DeliveredDays[0]);
    }, 1);
  }

  onSubmit(data: FormGroup) {
    if (data.valid) {
      const subData = this.getSubscriptionData(data);
      this._Store.dispatch(
        FETCH_NORMALPLAN_PRICE_START({
          data: {
            subscription_day_count: subData.subscription_days,
            meal_count: subData.meals.length,
            program_id: subData.program_id,
            snack_count: subData.snacks.length,
            include_breakfast: subData.meal_types.includes("breakfast")
          },
        }))
      this._Store.dispatch(SAVE_NORMAL_SUBSCRIPTION({ data: subData }));
      this._Store.dispatch(FETCH_SHOWMEALS_START({ data: subData }));
    }
  }

  getSubscriptionData(form: FormGroup) {
    let SelectedDate: Date = form.value.Start_Date;
    let SubscriptionData: ISubscriptionData = {
      program_id: Number(this.program_id),
      subscription_days: form.value.subscription_days,
      start_date: SelectedDate.toLocaleDateString('pt-br')
        .split('/')
        .reverse()
        .join('-'),
      delivery_days: this.getSelectedDeliveryDays(),
      meal_types: [
        ...this.getMealTypes(form.value.meal_types, this.meal_types),
        ...this.getSnackTypes(form.value.snack_types, this.snack_types),
      ],
      meals: this.getMealTypes(form.value.meal_types, this.meal_types),
      snacks: this.getSnackTypes(form.value.snack_types, this.snack_types),
    };
    return SubscriptionData;
  }

  getMealTypes(meals: number, meal_types: MealType[]) {
    let selectedMeals: string[] = [];
    if (this.ProgramDetailsForm.value.addBreakFast) {
      for (let i = 0; i <= meals; i++) {
        selectedMeals.push(meal_types[i].meal_name_backend);
      }
    } 
    else {
      for (let i = 1; i <= meals; i++) {
        selectedMeals.push(meal_types[i].meal_name_backend);
      }
    }
    return selectedMeals;
  }

  getSnackTypes(meals: boolean[], meal_types: MealType[]) {
    let selectedMeals: string[] = [];
    meals.forEach((status, index) => {
      if (status) {
        selectedMeals.push(meal_types[index].meal_name_backend);
      }
    });
    return selectedMeals;
  }

  getSelectedDeliveryDays() {
    const DeliveredDays = this.deliveredDays.nativeElement.children;
    let DaysCount: string[] = [];
    for (let i = 0; i < DeliveredDays.length; i++) {
      if (DeliveredDays[i].children[0].classList.contains('active')) {
        DaysCount.push(DeliveredDays[i].children[0].getAttribute('dayName'));
      }
    }
    let FilterDaysCount = DaysCount.filter((e) => e !== null);
    return FilterDaysCount;
  }

  checkDeliveryDays(e: HTMLElement) {
    this._SharedService.checkDays(e, this.AllWeek, this.ProgramDetailsForm);
    this.getAllWeekChecked();
  }

  getAllWeekChecked() {
    let days = this._ElementRef.nativeElement.querySelectorAll(
      '.deliveredDays .dayWeek.active'
    );
    if (days.length == 6) {
      this.AllWeek.nativeElement.classList.add('active');
    } else {
      this.AllWeek.nativeElement.classList.remove('active');
    }
  }

  checkAllWeekBtn(e: HTMLElement) {
    this._SharedService.checkAllWeek(e);
    if (e.classList.contains("active")) {
      Swal.fire({
        title: this.translate.instant('deliveryMsg'),
        confirmButtonText:
        this.translate.currentLang == 'ar' ? 'حسنا' : 'OK',
      })
    }
  }

  getDayNumber(Day_name: string | undefined | null) {
    return this._SharedService.getDayNumber(Day_name);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
// ================================================new logic===========================================

  getMealTypesCount(num: number) {
    const count = [];
    for (let i = 0; i <= num; i++) {
      if (i == 0) {
        count.push({
          displayName:`${this.translate.currentLang == 'ar' ? 'بدون وجبات' : 'No Meals'}`,
          value :i
        });
      } else if(i == 1) {
        count.push({
          displayName:`${i} ${this.translate.currentLang == 'ar' ? 'وجبه' : 'Meal'}`,
          value:i
        });
      }
      else {
        count.push({
          displayName:`${i} ${this.translate.currentLang == 'ar' ? 'وجبات' : 'Meals'}`,
          value:i
        });
      }
    }
    return count;
  }


  onMealsChange() {
    // this.ProgramDetailsForm
    //   .get('addBreakFast')
    //   ?.valueChanges.pipe(takeUntil(this.destroyed$))
    //   .subscribe((val) => {
        // const meal_types = this.ProgramDetailsForm.get('meal_types') as FormControl;
        // if (val) {
        //   meal_types.clearValidators();
        //   meal_types.updateValueAndValidity();
        // } else {
        //   meal_types.setValidators([Validators.required]);
        //   meal_types.updateValueAndValidity();
        // }
    //   });
    const meal_types = this.ProgramDetailsForm.get('meal_types') as FormControl;
    const breakFast = this.ProgramDetailsForm.get('addBreakFast') as FormControl;
    meal_types.patchValue(0)
    breakFast.patchValue(true)
    
      this.ProgramDetailsForm
      .get('meal_types')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((val) => {
        if (val == 0) {
          breakFast.patchValue(true)
        }
      });
  }

  onBreakfastChange(e:any){
    const meal_types = this.ProgramDetailsForm.get('meal_types') as FormControl;
    meal_types.setValidators(e.target.checked ? Validators.required : null);
    meal_types.updateValueAndValidity();
  }
}
