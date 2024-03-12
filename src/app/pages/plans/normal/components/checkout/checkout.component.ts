import {
  ChangeDetectorRef,
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
import * as fromNormalPlanSelector from 'src/app/store/normalPlanStore/normalPlan.selector';
import {
  combineLatest,
  map,
  Observable,
  of,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';
import {
  ICheckout,
  INormalPlanResponse,
  INormalProgramPriceResponse,
  IShowMealsResponse,
  ISubscriptionData,
} from 'src/app/interfaces/normal-plan.interface';
import { ILoginState } from 'src/app/store/authStore/auth.reducer';
import { loginSelector } from 'src/app/store/authStore/auth.selector';
import { FETCH_CHECKOUT_START } from 'src/app/store/normalPlanStore/normalPlan.action';
import { FETCH_STATE_START } from 'src/app/store/stateStore/state.action';
import { Area, IStateResponse } from 'src/app/interfaces/state.interface';
import { stateSelector } from 'src/app/store/stateStore/state.selector';
import { FETCH_USERADDRESS_START } from 'src/app/store/userAddressStore/address.action';
import { addressSelector } from 'src/app/store/userAddressStore/address.selector';
import { IAddressResponse } from 'src/app/interfaces/address.interface';
import Swal from 'sweetalert2';
import { AnimationOptions } from 'ngx-lottie';
import { FETCH_TERMS_START } from 'src/app/store/termsStore/terms.action';
import { ITermsResponse } from 'src/app/interfaces/terms.interface';
import { termsSelector } from 'src/app/store/termsStore/terms.selector';
import {
  giftCodeLoadingSelector,
  giftCodeSelector,
} from 'src/app/store/giftcodeStore/giftcode.selector';
import { FETCH_GIFTCODE_START } from 'src/app/store/giftcodeStore/giftcode.action';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import { FETCH_DISLIKE_START } from 'src/app/store/dislikeStore/dislike.action';
import { IDislikeResponse } from 'src/app/interfaces/dislike.interface';
import { dislikeSelector } from 'src/app/store/dislikeStore/dislike.selector';
import { Calendar } from 'primeng/calendar';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void> = new Subject();
  checkoutForm: FormGroup = new FormGroup({});
  checkoutForm_without_auth: FormGroup = new FormGroup({});
  subscriptionInfo$: Observable<ISubscriptionData | null> = of(null);
  price$: Observable<INormalProgramPriceResponse | null> = of(null);
  giftcodeButtonMode$: Observable<boolean | null> = of(false);
  dislike$!: Observable<IDislikeResponse[] | any>;
  states$!: Observable<IStateResponse[] | any>;
  terms$!: Observable<ITermsResponse[] | any>;
  ProgramDetails!: Observable<INormalPlanResponse | null>;
  login$!: Observable<ILoginState>;
  subscribtionModal: boolean = false;
  program_id: number = 0;
  price: number = 0;
  addresses$!: Observable<IAddressResponse[] | null>;
  addressesModal: boolean = false;
  termsModal: boolean = false;
  checkoutResponse$!: Observable<any>;
  options: AnimationOptions = {
    path: '../../../../../../assets/lottie/payment.json',
  };
  @ViewChild('lottie') lottie!: ElementRef;
  userMeals: IShowMealsResponse[] | null = [];
  areas: Area[] = [];
  deliveryStatus: any[] = [
    { name: 'Delivery', name_ar: 'توصيل', value: true },
    { name: 'Pick Up', name_ar: 'ألتقاط من المطعم', value: false },
  ];
  deliveryFees: number = 0;
  maxBirthdate: Date;
  minBirthdate: Date;
  global_extra_carb: any;
  global_extra_protein: any;
  isRamadan: boolean = false;

  constructor(
    private _Store: Store,
    private _Router: Router,
    private _FormBuilder: FormBuilder,
    private _ActivatedRoute: ActivatedRoute,
    private _I18nService: I18nService,
    public translate: TranslateService,
    private cdref: ChangeDetectorRef,
    private _SharedService: SharedService
  ) {
    this.maxBirthdate = new Date('2015-12-31');
    this.minBirthdate = new Date('1940-01-01');
    this._I18nService.getCurrentLang(this.translate);
    this.login$ = _Store.select(loginSelector);
    this.dislike$ = _Store.select(dislikeSelector);
    this.price$ = _Store.select(fromNormalPlanSelector.normalPlanPriceSelector);
    _Store
      .select(fromNormalPlanSelector.normalPlanPriceSelector)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.price = res ? res.price : 0;
      });
    _Store
      .select(fromNormalPlanSelector.normalSubscriptionMealsSelector)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.userMeals = res;
      });
    _Store
      .select(fromNormalPlanSelector.normalSubscriptionSelector)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res) {
          this._Store.dispatch(FETCH_DISLIKE_START());
          this.program_id = res.program_id;
          this.subscriptionInfo$ = _Store.select(
            fromNormalPlanSelector.normalSubscriptionSelector
          );
          this.ProgramDetails = this._Store.select(
            fromNormalPlanSelector.normalPlanSelector
          );
          this._Store
            .select(fromNormalPlanSelector.normalPlanSelector)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((res) => {
              if (res) {
                this.isRamadan = res.name.toLowerCase().includes('ramadan');
                this._Store.dispatch(FETCH_STATE_START());
              }
            });
          this.login$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res.data) {
              this._Store.dispatch(FETCH_USERADDRESS_START());
            }
          });
          this._Store.dispatch(FETCH_TERMS_START());
          this.states$ = this._Store.select(stateSelector);
          this.addresses$ = this._Store.select(addressSelector);
          this.terms$ = this._Store.select(termsSelector);
          this.checkoutResponse$ = this._Store.select(
            fromNormalPlanSelector.normalPlanResponseSelector
          );
        } else {
          this._Router.navigate(['set-plan'], {
            relativeTo: this._ActivatedRoute.parent,
          });
        }
      });
  }
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.setCheckoutForm();
    this.setCheckoutForm_Without_Auth();
    this.onDeliveryStatusChanges();
    this.checkoutForm_without_auth
      .get('area_id')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((area_id) => {
        const states: IStateResponse =
          this.checkoutForm_without_auth.value.state_id;
        this.getDeliveryFees(
          area_id,
          states,
          this.checkoutForm_without_auth.value.delivery_status
        );
      });
    this.checkoutForm
      .get('area_id')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((area_id) => {
        const states: IStateResponse = this.checkoutForm.value.state_id;
        this.getDeliveryFees(
          area_id,
          states,
          this.checkoutForm.value.delivery_status
        );
      });

    this.checkoutForm
      .get('delivery_status')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((status) => {
        const states: IStateResponse = this.checkoutForm.value.state_id;
        this.getDeliveryFees(this.checkoutForm.value.area_id, states, status);
      });

    this.checkoutForm_without_auth
      .get('delivery_status')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((status) => {
        const states: IStateResponse =
          this.checkoutForm_without_auth.value.state_id;
        this.getDeliveryFees(
          this.checkoutForm_without_auth.value.area_id,
          states,
          status
        );
      });

    this._SharedService.global_extra_protein
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.global_extra_protein = res;
      });

    this._SharedService.global_extra_carb
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.global_extra_carb = res;
      });
  }

  getDeliveryFees(
    area_id: number,
    states: IStateResponse,
    delivery_status: boolean
  ) {
    if (delivery_status && states && area_id) {
      let selectedArea = states.areas.find((e) => e.id == area_id);
      let sub: ISubscriptionData | null;
      this.subscriptionInfo$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((res) => (sub = res));
      let selectedFees = selectedArea?.fees.find(
        (e) => e.days == sub?.subscription_days
      );
      this.deliveryFees = selectedFees?.fees || 0;
    } else {
      this.deliveryFees = 0;
    }
    this.cdref.detectChanges();
  }

  // *****************************************************Reactive Forms*****************************************************

  setCheckoutForm() {
    this.checkoutForm = this._FormBuilder.group({
      address: new FormControl(null),
      state_id: new FormControl(null),
      area_id: new FormControl(null),
      terms: new FormControl(false, [Validators.requiredTrue]),
      delivery_status: new FormControl(false),
      dislike_meals: new FormControl(null),
    });
  }

  setCheckoutForm_Without_Auth() {
    this.checkoutForm_without_auth = this._FormBuilder.group({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required]),
      mobile: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[\\d]{10}$'),
      ]),
      address: new FormControl(null),
      state_id: new FormControl(null),
      area_id: new FormControl(null),
      terms: new FormControl(false, [Validators.requiredTrue]),
      delivery_status: new FormControl(false),
      dislike_meals: new FormControl(null),
      birthday: new FormControl(null),
      // cutlery: new FormControl(false),
      // bag: new FormControl(false),
    });
  }

  // *****************************************************GiftCode*****************************************************

  applyGiftCode(input: HTMLInputElement) {
    if (input.value != '') {
      this.giftcodeButtonMode$ = this._Store.select(giftCodeLoadingSelector);

      let prevPrice$ = this._Store.select(
        fromNormalPlanSelector.normalPlanPriceSelector
      );

      let subscription: any;
      this.subscriptionInfo$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((res) => (subscription = res));

      this._Store.dispatch(
        FETCH_GIFTCODE_START({
          data: {
            code: input.value,
            subscription_days: subscription.subscription_days,
            price: this.price,
            program_id: this.program_id,
            global_extra_protein: this.global_extra_protein,
            global_extra_carb: this.global_extra_carb,
            include_breakfast: Number(subscription.meals.includes('breakfast')),
            meal_count: subscription.meals.includes('breakfast')
              ? subscription.meals.length - 1
              : subscription.meals.length,
            snack_count: subscription.snacks.length,
          },
        })
      );

      this.price$ = this._Store.select(giftCodeSelector).pipe(
        map((giftCode) => {
          return giftCode;
        })
      );

      this.price$ = combineLatest([
        this._Store.select(giftCodeSelector),
        prevPrice$,
      ]).pipe(
        map(([giftCode, prevPrice]) => {
          if (giftCode && prevPrice) {
            const updatedObject = {
              ...giftCode,
              extra_details: prevPrice.extra_details,
              global_extra_carb: prevPrice.global_extra_carb,
              global_extra_protein: prevPrice.global_extra_protein,
            };
            giftCode = updatedObject;
          }
          return giftCode;
        })
      );
    }
  }

  // *****************************************************checkout*****************************************************

  checkout_With_Auth(form: FormGroup) {
    if (form.valid) {
      let sub: any;
      let priceinfo: any;

      this.subscriptionInfo$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((res) => (sub = res));

      this.price$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((res) => (priceinfo = res));

      const checkout: ICheckout = {
        delivery_days: sub?.delivery_days,
        meal_backend_types: sub?.meal_types.filter(
          (item: any) => !item.startsWith('snack')
        ),
        snack_backend_types: sub?.meal_types.filter((item: any) =>
          item.startsWith('snack')
        ),
        no_snacks: sub?.no_snacks,
        program_id: sub?.program_id,
        plan_option_id: sub?.plan_option_id,
        start_date: sub?.start_date,
        dislike_meals: form.value.dislike_meals,
        delivery_status: form.value.delivery_status,
        code_id: priceinfo?.code_id,
        price: priceinfo?.price,
        total_price: priceinfo?.grand_total,
        state_id: form.value.state_id,
        area_id: form.value.area_id,
        subscription_days: sub?.subscription_days,
        subscription_from: 'web',
        address_id: form.value.address,
        address: form.value.address,
        list_days: this.userMeals ? this.userMeals : [],
        global_extra_carb: this.global_extra_carb,
        global_extra_protein: this.global_extra_protein,
        include_breakfast: sub.meal_types.includes('breakfast'),
      };
      checkout.state_id = 0;
      this._Store.dispatch(FETCH_CHECKOUT_START({ data: checkout }));
      this.fireSwal();
      this.redirectToPaymentGateway();
    }
  }

  checkout_Without_Auth(form: FormGroup) {
    if (form.valid) {
      let sub: any;
      let priceinfo: any;
      this.subscriptionInfo$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((res) => (sub = res));

      this.price$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((res) => (priceinfo = res));

      const checkout: ICheckout = {
        delivery_days: sub?.delivery_days,
        meal_backend_types: sub?.meal_types.filter(
          (item: any) => !item.startsWith('snack')
        ),
        snack_backend_types: sub?.meal_types.filter((item: any) =>
          item.startsWith('snack')
        ),
        no_snacks: sub?.no_snacks,
        program_id: sub?.program_id,
        plan_option_id: sub?.plan_option_id,
        start_date: sub?.start_date,
        dislike_meals: form.value.dislike_meals,
        delivery_status: form.value.delivery_status,
        code_id: priceinfo?.code_id,
        price: priceinfo?.price,
        total_price: priceinfo?.grand_total,
        state_id: form.value.state_id,
        area_id: form.value.area_id,
        address: form.value.address,
        name: form.value.name,
        email: form.value.email,
        mobile: form.value.mobile,
        password: form.value.password,
        subscription_days: sub?.subscription_days,
        subscription_from: 'web',
        address_id: form.value.state_id,
        list_days: this.userMeals ? this.userMeals : [],
        global_extra_carb: this.global_extra_carb,
        global_extra_protein: this.global_extra_protein,
        include_breakfast: sub.meal_types.includes('breakfast'),
      };
      checkout.state_id = 0;
      this._Store.dispatch(FETCH_CHECKOUT_START({ data: checkout }));
      this.fireSwal();
      this.redirectToPaymentGateway();
    }
  }

  redirectToPaymentGateway() {
    this.checkoutResponse$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      res.loading == false && this.paymentSwal.close();
      if (res.data) {
        res.status == 1 && (window.location.href = res.data);
      } else {
        if (res.message !== null && res.status == 0) {
          Swal.fire({
            icon: 'error',
            title: this.translate.currentLang == 'ar' ? 'أُووبس...' : 'Oops...',
            // text: this.translate.currentLang == 'ar' ?'هناك مشكلة. يرجى الاتصال بخدمة العملاء لدينا':`There's an issue. Please call our Customer Service`,
            html:
              this.translate.currentLang == 'ar'
                ? 'هناك مشكلة. يرجى الاتصال بخدمة العملاء لدينا <a target="_blank" href="https://api.whatsapp.com/send?phone=9660595036614"> أضغط هنا </a> '
                : `There's an issue. Please call our Customer Service 
            <a target="_blank" href="https://api.whatsapp.com/send?phone=9660595036614"> Here </a>`,
            confirmButtonText:
              this.translate.currentLang == 'ar' ? 'حسنا' : 'OK',
          });
        }
      }
    });
  }

  // *****************************************************Address*****************************************************

  displayUserAddressModal() {
    this.addresses$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      if (res == null) {
        this._Store.dispatch(FETCH_USERADDRESS_START());
      }
    });
    this.addressesModal = true;
  }

  selectAddress(address: IAddressResponse) {
    this.states$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      const [state] = res.filter((s: any) => s.id == address.area.state.id);
      this.checkoutForm.get('state_id')?.setValue(state);
      const [area] = state.areas.filter((a: any) => a.id == address.area.id);
      this.checkoutForm.get('area_id')?.setValue(area.id);
    });
    this.checkoutForm.get('address')?.setValue(address.address);
    this.addressesModal = false;
  }

  // *****************************************************Swal && Lottie*****************************************************
  paymentSwal: any;
  fireSwal() {
    this.paymentSwal = Swal.mixin({
      showConfirmButton: false,
      timerProgressBar: false,
    });

    this.paymentSwal.fire({
      html: this.lottie.nativeElement,
      title: this.translate.instant('checkoutMSG'),
    });
  }

  // *****************************************************Terms*****************************************************
  onCheckTermsChange(event: any) {
    event.target.checked && (this.termsModal = true);
  }

  // *****************************************************check delivery status*****************************************************

  onDeliveryStatusChanges() {
    this.checkoutForm
      .get('delivery_status')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((val) => {
        const address = this.checkoutForm.get('address') as FormControl;
        const state_id = this.checkoutForm.get('state_id') as FormControl;
        const area_id = this.checkoutForm.get('area_id') as FormControl;
        if (val) {
          address.setValidators([Validators.required]);
          address.updateValueAndValidity();
          state_id.setValidators([Validators.required]);
          state_id.updateValueAndValidity();
          area_id.setValidators([Validators.required]);
          area_id.updateValueAndValidity();
          this.displayWarning();
        } else {
          address.clearValidators();
          address.updateValueAndValidity();
          state_id.clearValidators();
          state_id.updateValueAndValidity();
          area_id.clearValidators();
          area_id.updateValueAndValidity();
        }
      });
    this.checkoutForm_without_auth
      .get('delivery_status')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((val) => {
        const address = this.checkoutForm_without_auth.get(
          'address'
        ) as FormControl;
        const state_id = this.checkoutForm_without_auth.get(
          'state_id'
        ) as FormControl;
        const area_id = this.checkoutForm_without_auth.get(
          'area_id'
        ) as FormControl;
        if (val) {
          address.setValidators([Validators.required]);
          address.updateValueAndValidity();
          state_id.setValidators([Validators.required]);
          state_id.updateValueAndValidity();
          area_id.setValidators([Validators.required]);
          area_id.updateValueAndValidity();
          this.displayWarning();
        } else {
          address.clearValidators();
          address.updateValueAndValidity();
          state_id.clearValidators();
          state_id.updateValueAndValidity();
          area_id.clearValidators();
          area_id.updateValueAndValidity();
        }
      });
  }

  displayWarning() {
    Swal.fire({
      title: this.translate.instant('delivery_status_msg'),
      confirmButtonText:
        this.translate.currentLang == 'ar'
          ? 'الرجاء المتابعة'
          : 'Please Proceed',
    });
  }
  // =========================== DOB
  @ViewChild('calendar') calendar!: Calendar;
  onDateChange(e: any) {
    if (this.calendar.view == 'year') {
      this.calendar.view = 'month';
      this.calendar.dateFormat = 'yy/mm';
      this.showDialog();
    } else if (this.calendar.view == 'month') {
      this.calendar.view = 'date';
      this.calendar.dateFormat = 'yy/mm/dd';
      this.showDialog();
    }
  }

  showDialog() {
    setTimeout(() => {
      this.calendar.showOverlay();
      this.calendar.inputfieldViewChild.nativeElement.dispatchEvent(
        new Event('click')
      );
    }, 200);
  }

  onClearClick() {
    this.calendar.view = 'year';
  }
}
