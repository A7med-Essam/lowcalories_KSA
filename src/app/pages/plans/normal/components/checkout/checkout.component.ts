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
    { name: 'Delivery', value: true },
    { name: 'Pick Up', value: false },
  ];
  deliveryFees: number = 0;
  maxBirthdate:Date;
  minBirthdate: Date;
  constructor(
    private _Store: Store,
    private _Router: Router,
    private _FormBuilder: FormBuilder,
    private _ActivatedRoute: ActivatedRoute,
    private _I18nService: I18nService,
    public translate: TranslateService,
    private cdref: ChangeDetectorRef
  ) {
    this.maxBirthdate = new Date("2015-12-31")
    this.minBirthdate = new Date('1940-01-01')
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
      address: new FormControl(null, [Validators.required]),
      state_id: new FormControl(null, [Validators.required]),
      area_id: new FormControl(null, [Validators.required]),
      terms: new FormControl(false, [Validators.requiredTrue]),
      delivery_status: new FormControl(true),
      dislike_meals: new FormControl(null),
    });
  }

  setCheckoutForm_Without_Auth() {
    this.checkoutForm_without_auth = this._FormBuilder.group({
      name: new FormControl(null,[Validators.required]),
      email: new FormControl(null, [Validators.email,Validators.required]),
      password: new FormControl(null,[Validators.required]),
      mobile: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[\\d]{10}$'),
      ]),
      address: new FormControl(null, [Validators.required]),
      state_id: new FormControl(null, [Validators.required]),
      area_id: new FormControl(null, [Validators.required]),
      terms: new FormControl(false, [Validators.requiredTrue]),
      delivery_status: new FormControl(true),
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

      this._Store.dispatch(
        FETCH_GIFTCODE_START({
          data: {
            code: input.value,
            price: this.price,
            program_id: this.program_id,
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
      let extra_prices: any;

      this.subscriptionInfo$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((res) => (sub = res));

      this.price$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((res) => (priceinfo = res));

        this.ProgramDetails
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res=> extra_prices = res?.extra_prices)

        const c = (((priceinfo.global_extra_carb / extra_prices.carb) / sub.subscription_days) ) * 50;
        const p = (((priceinfo.global_extra_protein / extra_prices.protein) / sub.subscription_days) ) * 50;

      const checkout: ICheckout = {
        delivery_days: sub?.delivery_days,
        meal_backend_types: sub?.meal_types,
        no_snacks: sub?.no_snacks,
        program_id: sub?.program_id,
        plan_option_id: sub?.plan_option_id,
        start_date: sub?.start_date,
        dislike_meals: form.value.dislike_meals,
        // bag: Number(form.value.bag),
        // cutlery: Number(form.value.cutlery),
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
        global_extra_carb:c,
        global_extra_protein:p
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
      let extra_prices: any;
      this.subscriptionInfo$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((res) => (sub = res));

      this.price$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((res) => (priceinfo = res));
      this.ProgramDetails
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res=> extra_prices = res?.extra_prices)

      // sub.subscription_days * sub.meal_types 
      // 6  * 1 * 6
      // 72/6/6/1*50

      const c = (((priceinfo.global_extra_carb / extra_prices.carb) / sub.subscription_days) ) * 50;
      const p = (((priceinfo.global_extra_protein / extra_prices.protein) / sub.subscription_days) ) * 50;

      const checkout: ICheckout = {
        delivery_days: sub?.delivery_days,
        meal_backend_types: sub?.meal_types,
        no_snacks: sub?.no_snacks,
        program_id: sub?.program_id,
        plan_option_id: sub?.plan_option_id,
        start_date: sub?.start_date,
        dislike_meals: form.value.dislike_meals,
        // bag: Number(form.value.bag),
        // cutlery: Number(form.value.cutlery),
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
        global_extra_carb:c,
        global_extra_protein:p
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
            text: res.message,
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
        const address = this.checkoutForm_without_auth.get('address') as FormControl;
        const state_id = this.checkoutForm_without_auth.get('state_id') as FormControl;
        const area_id = this.checkoutForm_without_auth.get('area_id') as FormControl;
        if (val) {
          address.setValidators([Validators.required]);
          address.updateValueAndValidity();
          state_id.setValidators([Validators.required]);
          state_id.updateValueAndValidity();
          area_id.setValidators([Validators.required]);
          area_id.updateValueAndValidity();
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
