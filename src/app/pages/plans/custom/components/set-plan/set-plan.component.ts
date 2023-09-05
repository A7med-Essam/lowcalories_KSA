import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import {
  ICustomPlanResponse,
  ISubscriptionData,
} from 'src/app/interfaces/custom-plan.interface';
import { SharedService } from 'src/app/services/shared.service';
import {
  FETCH_CUSTOMPLAN_SHOWCATEGORIES_START,
  FETCH_CUSTOMPLAN_SHOWMEALS_START,
  FETCH_CUSTOMPLAN_START,
  SAVE_CUSTOM_SUBSCRIPTION,
} from 'src/app/store/customPlanStore/customPlan.action';
import * as fromCustomPlanSelector from '../../../../../store/customPlanStore/customPlan.selector';

@Component({
  selector: 'app-set-plan',
  templateUrl: './set-plan.component.html',
  styleUrls: ['./set-plan.component.scss'],
})
export class SetPlanComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void> = new Subject();
  program_id: number = 0;
  ProgramDetails!: Observable<ICustomPlanResponse[] | null>;
  ProgramDetailsForm: FormGroup = new FormGroup({});
  skeletonMode$: Observable<boolean | null> = of(false);
  selectedPlanType!: ICustomPlanResponse;
  max_meal: string[] = [];
  max_snack: string[] = [];
  max_days: string[] = [];
  @ViewChild('AllWeek') AllWeek!: ElementRef;
  uaeDate!: Date;
  @ViewChild('deliveredDays') deliveredDays!: ElementRef;
  nextButtonMode$: Observable<boolean | null> = of(false);

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private _FormBuilder: FormBuilder,
    private _Store: Store,
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
          FETCH_CUSTOMPLAN_START({ program_id: this.program_id })
        );
        this.setProgramDetailsForm();
        this.ProgramDetails = this._Store.select(
          fromCustomPlanSelector.customPlanSelector
        );
        this.skeletonMode$ = this._Store.select(
          fromCustomPlanSelector.customPlanLoadingSelector
        );
        this.nextButtonMode$ = this._Store.select(
          fromCustomPlanSelector.showMealsLoadingSelector
        );
        this.getUaeDate();
      }
    });
  }

  setProgramDetailsForm() {
    this.ProgramDetailsForm = this._FormBuilder.group({
      Number_of_Meals: new FormControl(null, [Validators.required]),
      Number_of_Days: new FormControl(null, [Validators.required]),
      Start_Date: new FormControl(null, [Validators.required]),
      Plan_Type: new FormControl(null, [Validators.required]),
      Type_of_Snacks: new FormControl(null, [Validators.required]),
      CheckDays: new FormControl(null),
    });
  }

  getSelectedPlanType(val: ICustomPlanResponse) {
    this.selectedPlanType = val;
    this.ProgramDetailsForm.get('Number_of_Meals')?.setValue(null);
    this.ProgramDetailsForm.get('Number_of_Days')?.setValue(null);
    this.ProgramDetailsForm.get('Type_of_Snacks')?.setValue(null);
    this.getProgramDetails();
  }

  getProgramDetails() {
    this.ProgramDetails.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      if (res) {
        for (let i = 1; i <= this.selectedPlanType.details.max_meal; i++) {
          this.max_meal.push(i.toString());
        }
        for (let i = 0; i <= this.selectedPlanType.details.max_snack; i++) {
          this.max_snack.push(i.toString());
        }
        for (
          let i = this.selectedPlanType.details.min_days;
          i <= this.selectedPlanType.details.max_days;
          i++
        ) {
          // this.max_days.push(i.toString());
          this.max_days = ["7","14","21","28"]
        }
      }
    });
  }

  onSubmit(data: FormGroup) {
    if (data.valid) {
      this._Store.dispatch(
        SAVE_CUSTOM_SUBSCRIPTION({ data: this.getSubscriptionData(data) })
      );
      this._Store.dispatch(
        FETCH_CUSTOMPLAN_SHOWMEALS_START({ plan_id: data.value.Plan_Type.id })
      );
      this._Store.dispatch(
        FETCH_CUSTOMPLAN_SHOWCATEGORIES_START({
          plan_id: data.value.Plan_Type.id,
        })
      );
    }
  }

  getSubscriptionData(data: FormGroup) {
    let SelectedDate: Date = data.value.Start_Date;
    let SubscriptionData: ISubscriptionData = {
      Plan_Type: data.value.Plan_Type,
      program_id: Number(this.program_id),
      start_date: SelectedDate.toLocaleDateString('pt-br')
        .split('/')
        .reverse()
        .join('-'),
      delivery_days: this.getSelectedDeliveryDays(),
      number_of_Days: data.value.Number_of_Days,
      number_of_Meals: this.getSelectedMealTypes(
        Number(data.value.Number_of_Meals)
      ),
      number_of_Snacks: Number(data.value.Type_of_Snacks),
    };
    return SubscriptionData;
  }

  getSelectedMealTypes(num: number) {
    let meals = [];
    for (let i = 1; i <= num; i++) {
      meals.push(`Meal ${i}`);
    }
    return meals;
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

  onSelectedDate(SelectedDate: Date, deliveredDays: HTMLElement) {
    this._SharedService.onSelectedDate(SelectedDate, deliveredDays);
  }

  getDayNumber(Day_name: string | undefined | null) {
    return this._SharedService.getDayNumber(Day_name);
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

  getUaeDate() {
    this.uaeDate = this._SharedService.getUaeTime();
  }

  delivery_days = [
    {
      id: 8,
      day_name: 'SATURDAY',
      day_name_ar: 'السبت',
      closed: 0,
      deleted_at: null,
      day_name_in_view: 'Saturday',
    },
    {
      id: 9,
      day_name: 'SUNDAY',
      day_name_ar: 'الاحد',
      closed: 0,
      deleted_at: null,
      day_name_in_view: 'Sunday',
    },
    {
      id: 10,
      day_name: 'MONDAY',
      day_name_ar: 'الاثنين',
      closed: 0,
      deleted_at: null,
      day_name_in_view: 'Monday',
    },
    {
      id: 11,
      day_name: 'TUSEDAY',
      day_name_ar: 'الثلاثاء',
      closed: 0,
      deleted_at: null,
      day_name_in_view: 'Tuesday',
    },
    {
      id: 12,
      day_name: 'WEDNESDAY',
      day_name_ar: 'الاربعاء',
      closed: 0,
      deleted_at: null,
      day_name_in_view: 'Wednesday',
    },
    {
      id: 13,
      day_name: 'THURSDAY',
      day_name_ar: 'الخميس',
      closed: 0,
      deleted_at: null,
      day_name_in_view: 'Thursday',
    },
  ];
}
