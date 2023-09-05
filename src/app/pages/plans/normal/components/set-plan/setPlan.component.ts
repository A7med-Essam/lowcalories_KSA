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
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import {
  INormalPlanResponse,
  IOptions,
  ISubscriptionData,
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
export class SetPlanComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  private destroyed$: Subject<void> = new Subject();
  @ViewChild('AllWeek') AllWeek!: ElementRef;
  @ViewChild('deliveredDays') deliveredDays!: ElementRef;
  @ViewChild('MealsType') MealsType!: ElementRef;
  @ViewChild('SnacksType') SnacksType!: ElementRef;
  uaeDate!: Date;
  ProgramDetails!: Observable<INormalPlanResponse[] | null>;
  program_id: number = 0;
  ProgramDetailsForm: FormGroup = new FormGroup({});
  skeletonMode$: Observable<boolean | null> = of(false);
  nextButtonMode$: Observable<boolean | null> = of(false);
  selectedProgramOptions: IOptions[] = [];
  no_snacks: string[] = [];
  selectedSnack: string = '0';
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
        this.setProgramDetailsForm();
        this.ProgramDetails = this._Store.select(
          fromNormalPlanSelector.normalPlanSelector
        );
        this.skeletonMode$ = this._Store.select(
          fromNormalPlanSelector.normalPlanLoadingSelector
        );
        this.nextButtonMode$ = this._Store.select(
          fromNormalPlanSelector.showMealsLoadingSelector
        );
        this.transformProgramDetails();
        this.getUaeDate();
      }
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getSelectedNumberOfMeals(val: INormalPlanResponse) {
    this.ProgramDetailsForm.get('Number_of_Days')?.setValue(null);
    this.selectedProgramOptions = val.options;
  }

  setProgramDetailsForm() {
    this.ProgramDetailsForm = this._FormBuilder.group({
      Number_of_Meals: new FormControl(null, [Validators.required]),
      Number_of_Days: new FormControl(null, [Validators.required]),
      Start_Date: new FormControl(null, [Validators.required]),
      Type_of_Snacks: new FormControl('0'),
      CheckDays: new FormControl(null),
    });
  }

  onSelectedDate(SelectedDate: Date, deliveredDays: HTMLElement) {
    this._SharedService.onSelectedDate(SelectedDate, deliveredDays);
  }

  transformProgramDetails() {
    this.ProgramDetails.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      if (res) {
        res.forEach((e) => {
          e.no_meals.toString();
        });
        for (let i = 0; i <= res[0].myprogram.no_snacks; i++) {
          this.no_snacks.push(i.toString());
        }
        this.getSelectedNumberOfMeals(res[0]);
        this.ProgramDetailsForm.get('Number_of_Meals')?.setValue(res[0]);
        this.ProgramDetailsForm.get('Number_of_Days')?.setValue(
          res[0].options[0].id
        );
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

  getSubscriptionData(data: FormGroup) {
    let SelectedDate: Date = data.value.Start_Date;
    let SubscriptionData: ISubscriptionData = {
      plan_option_id: data.value.Number_of_Days,
      no_days: Number(
        this.getOptionById(
          data.value.Number_of_Meals.options,
          data.value.Number_of_Days
        )?.no_days
      ),
      start_date: SelectedDate.toLocaleDateString('pt-br')
        .split('/')
        .reverse()
        .join('-'),
      delivery_days: this.getSelectedDeliveryDays(),
      meal_types: this.getSelectedMealTypes(
        Number(data.value.Number_of_Meals.no_meals)
      ),
      program_id: Number(this.program_id),
      no_snacks: Number(data.value.Type_of_Snacks),
    };
    return SubscriptionData;
  }

  getOptionById(optionsArr: IOptions[], id: number) {
    return optionsArr.find((option) => option.id === id);
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
