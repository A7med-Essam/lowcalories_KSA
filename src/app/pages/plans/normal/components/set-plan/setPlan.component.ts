import {
  Component,
  ElementRef,
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
import { Observable, of, Subject, takeUntil } from 'rxjs';
import {
  DeliveryDay,
  INormalPlanResponse,
  ISubscriptionData,
  MealType,
  SubscriptionDay,
} from 'src/app/interfaces/normal-plan.interface';
import {
  FETCH_NORMALPLAN_START,
  FETCH_SHOWMEALS_START,
  SAVE_NORMAL_SUBSCRIPTION,
} from 'src/app/store/normalPlanStore/normalPlan.action';
import * as fromNormalPlanSelector from '../../../../../store/normalPlanStore/normalPlan.selector';
import { ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/core/i18n/i18n.service';

@Component({
  selector: 'app-setPlan',
  templateUrl: './setPlan.component.html',
  styleUrls: ['./setPlan.component.scss'],
})
export class SetPlanComponent implements OnInit, OnDestroy, AfterContentChecked {
  private destroyed$: Subject<void> = new Subject();
  @ViewChild('AllWeek') AllWeek!: ElementRef;
  @ViewChild('deliveredDays') deliveredDays!: ElementRef;
  uaeDate!: Date;
  ProgramDetails!: Observable<INormalPlanResponse | null>;
  program_id: number = 0;
  ProgramDetailsForm: FormGroup = new FormGroup({});
  skeletonMode$: Observable<boolean | null> = of(false);
  nextButtonMode$: Observable<boolean | null> = of(false);

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private _FormBuilder: FormBuilder,
    private _Store: Store,
    private cdref: ChangeDetectorRef,
    private _SharedService: SharedService,
    private _ElementRef: ElementRef,
    private _I18nService: I18nService,
    public translate: TranslateService,
  ) {
    this._I18nService.getCurrentLang(this.translate);
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
        this.getUaeDate();
      }
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  createPlanForm() {
    this.ProgramDetailsForm = this._FormBuilder.group({
      Start_Date: new FormControl(null, [Validators.required]),
      subscription_days: new FormControl(null,[Validators.required]),
      meal_types: new FormArray([], [this.atLeastOneCheckedValidator()]),
      snack_types: new FormArray([]),
      CheckDays: new FormControl(null),
    });
  }

  atLeastOneCheckedValidator(): ValidatorFn {
    return (formArray: AbstractControl): { [key: string]: boolean } | null => {
      if (formArray && formArray instanceof FormArray) {
        const values = formArray.value as boolean[];
        const hasChecked = values.some(value => value === true);
  
        return hasChecked ? null : { atLeastOneChecked: true };
      }
  
      return null;
    };
  }

  onSelectedDate(SelectedDate: Date, deliveredDays: HTMLElement) {
    this._SharedService.onSelectedDate(SelectedDate, deliveredDays);
  }

  meal_types:MealType[] = []
  snack_types:MealType[] = []
  subscription_days: SubscriptionDay[] = [];
  delivery_days:DeliveryDay[] = [];

  getProgramDetails() {
    this.ProgramDetails.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      if (res) {
        this.delivery_days = res.delivery_days.filter(day => day.closed !== 1);
        this.subscription_days = res.subscription_days;
        this.ProgramDetailsForm.get('subscription_days')?.setValue(res.subscription_days[0].day_count);
        this.meal_types = res.meal_types;
        this.meal_types.forEach(() => {
          const meal_types_FormArray  :any= this.ProgramDetailsForm.get('meal_types')
          let condition = meal_types_FormArray.controls.length == 0;
          (this.ProgramDetailsForm.get('meal_types') as FormArray).push(new FormControl(condition));
        });
        this.snack_types = res.snack_types
        this.snack_types.forEach(() => {
          (this.ProgramDetailsForm.get('snack_types') as FormArray).push(new FormControl(false));
        });
        this.setDefaultDate();
      }
    });
  }

  getUaeDate() {
    this.uaeDate = this._SharedService.getUaeTime();
  }

  setDefaultDate() {
    setTimeout(() => {
      let DefaultDate: Date = this.uaeDate;
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
      this._Store.dispatch(SAVE_NORMAL_SUBSCRIPTION({ data: subData }));
      this._Store.dispatch(FETCH_SHOWMEALS_START({ data: subData }));
    }
  }

  getSubscriptionData(form: FormGroup) {
    let SelectedDate: Date = form.value.Start_Date;
    let SubscriptionData: ISubscriptionData = {
      program_id: Number(this.program_id),
      subscription_days:form.value.subscription_days,
      start_date: SelectedDate.toLocaleDateString('pt-br').split('/').reverse().join('-'),
      delivery_days: this.getSelectedDeliveryDays(),
      meal_types: [...this.getMealTypes(form.value.meal_types,this.meal_types)
        ,...this.getMealTypes(form.value.snack_types,this.snack_types)],
      meals:this.getMealTypes(form.value.meal_types,this.meal_types),
      snacks:this.getMealTypes(form.value.snack_types,this.snack_types)
    };
    return SubscriptionData;
  }
  
  getMealTypes(meals:boolean[],meal_types:MealType[]){
    let selectedMeals: string[] = [];
    meals.forEach((status, index) => {
      if (status) {
        selectedMeals.push(meal_types[index].meal_name_backend)
      }
    });
    return selectedMeals
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
  }

  getDayNumber(Day_name: string | undefined | null) {
    return this._SharedService.getDayNumber(Day_name);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
