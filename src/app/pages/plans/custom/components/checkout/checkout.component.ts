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
import * as fromCustomPlanSelector from 'src/app/store/customPlanStore/customPlan.selector';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { ILoginState } from 'src/app/store/authStore/auth.reducer';
import { loginSelector } from 'src/app/store/authStore/auth.selector';
import { FETCH_EMIRATE_START } from 'src/app/store/emirateStore/emirate.action';
import { IEmirateResponse } from 'src/app/interfaces/emirate.interface';
import { emirateSelector } from 'src/app/store/emirateStore/emirate.selector';
import { FETCH_USERADDRESS_START } from 'src/app/store/userAddressStore/address.action';
import { addressSelector } from 'src/app/store/userAddressStore/address.selector';
import { IAddressResponse } from 'src/app/interfaces/address.interface';
import Swal from 'sweetalert2';
import { AnimationOptions } from 'ngx-lottie';
import { FETCH_TERMS_START } from 'src/app/store/termsStore/terms.action';
import { ITermsResponse } from 'src/app/interfaces/terms.interface';
import { termsSelector } from 'src/app/store/termsStore/terms.selector';
import {
  ICards,
  ICheckout,
  ICheckoutListDay,
  ICheckoutMeal,
  ICustomPlanResponse,
  ICustomProgramPriceResponse,
  ISubscriptionData,
} from 'src/app/interfaces/custom-plan.interface';
import { FETCH_CHECKOUT_START } from 'src/app/store/customPlanStore/customPlan.action';
import { FETCH_GIFTCODE_START } from 'src/app/store/giftcodeStore/giftcode.action';
import { giftCodeLoadingSelector, giftCodeSelector } from 'src/app/store/giftcodeStore/giftcode.selector';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/core/i18n/i18n.service';

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
  price$: Observable<ICustomProgramPriceResponse | null> = of(null);
  giftcodeButtonMode$: Observable<boolean | null> = of(false);
  emirates$!: Observable<IEmirateResponse[] | any>;
  terms$!: Observable<ITermsResponse[] | any>;
  ProgramDetails!: Observable<ICustomPlanResponse[] | null>;
  login$!: Observable<ILoginState>;
  cards$!: Observable<ICards[] | null>;
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

  constructor(
    private _Store: Store,
    private _Router: Router,
    private _FormBuilder: FormBuilder,
    private _ActivatedRoute: ActivatedRoute,
    private _I18nService: I18nService,
    public translate: TranslateService,
  ) {
    this._I18nService.getCurrentLang(this.translate);
    this.login$ = _Store.select(loginSelector);
    this.cards$ = _Store.select(fromCustomPlanSelector.CustomCardsSelector);
    this.price$ = _Store.select(fromCustomPlanSelector.customPlanPriceSelector);
    _Store
      .select(fromCustomPlanSelector.customPlanPriceSelector)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.price = res ? res.price : 0;
      });
    _Store
      .select(fromCustomPlanSelector.CustomSubscriptionSelector)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res) {
          this.program_id = res.program_id;
          this.subscriptionInfo$ = _Store.select(
            fromCustomPlanSelector.CustomSubscriptionSelector
          );
          this.ProgramDetails = this._Store.select(
            fromCustomPlanSelector.customPlanSelector
          );
          this._Store.dispatch(FETCH_EMIRATE_START({programType:res.Plan_Type.myprogram.company}));
          this._Store.dispatch(FETCH_USERADDRESS_START());
          this._Store.dispatch(FETCH_TERMS_START());
          this.emirates$ = this._Store.select(emirateSelector);
          this.addresses$ = this._Store.select(addressSelector);
          this.terms$ = this._Store.select(termsSelector);
          this.checkoutResponse$ = this._Store.select(
            fromCustomPlanSelector.customPlanResponseSelector
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
  }

  // *****************************************************Reactive Forms*****************************************************

  setCheckoutForm() {
    this.checkoutForm = this._FormBuilder.group({
      address: new FormControl(null, [Validators.required]),
      emirate_id: new FormControl(null, [Validators.required]),
      area_id: new FormControl(null, [Validators.required]),
      terms: new FormControl(false, [Validators.requiredTrue]),
      cutlery:new FormControl(false),
      bag:new FormControl(false),
    });
  }

  setCheckoutForm_Without_Auth() {
    this.checkoutForm_without_auth = this._FormBuilder.group({
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      phone_number: new FormControl(null, [Validators.required,Validators.pattern('^[\\d]{10}$'),]),
      address: new FormControl(null, [Validators.required]),
      emirate_id: new FormControl(null, [Validators.required]),
      area_id: new FormControl(null, [Validators.required]),
      terms: new FormControl(false, [Validators.requiredTrue]),
      cutlery:new FormControl(false),
      bag:new FormControl(false),
    });
  }

  // *****************************************************GiftCode*****************************************************

  applyGiftCode(input: HTMLInputElement) {
    if (input.value != '') {
      this.giftcodeButtonMode$ = this._Store.select(
        giftCodeLoadingSelector
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
      this.price$ = this._Store.select(
        giftCodeSelector
      );
    }
  }

  // *****************************************************checkout*****************************************************

  checkout_With_Auth(form: FormGroup) {
    if (form.valid) {
      this.cards$.pipe(takeUntil(this.destroyed$)).subscribe((cards) => {
        if (cards) {
          const list_days: ICheckoutListDay[] = [];
          cards.forEach((item) => {
            const cardItem: ICheckoutListDay = {
              day: item.day,
              date: item.date,
              meals: [],
            };
            item.meals.forEach((meal) => {
              const cartMeal: ICheckoutMeal = {
                meal_id: meal.details.id,
                main_unit: meal.details.mainDish.unit,
                side_unit: meal.details?.sideDish?.unit || 'NONE',
                max_main: meal.details.mainDish.max_meal,
                max_side: meal.details?.sideDish?.max_meal || 0,
                type: 'MEAL',
              };

              cardItem.meals.push(cartMeal);
            });

            item.snacks.forEach((meal) => {
              const cartMeal: ICheckoutMeal = {
                meal_id: meal.details.id,
                main_unit: meal.details.mainDish.unit,
                side_unit: meal.details?.sideDish?.unit || 'NONE',
                max_main: meal.details.mainDish.max_meal,
                max_side: meal.details?.sideDish?.max_meal || 0,
                type: 'SNACK',
              };

              cardItem.meals.push(cartMeal);
            });

            list_days.push(cardItem);
          });
          this.price$
            .pipe(takeUntil(this.destroyed$))
            .subscribe((priceinfo) => {
              this.subscriptionInfo$
                .pipe(takeUntil(this.destroyed$))
                .subscribe((res) => {
                  if (res) {
                    const checkout: ICheckout = {
                      delivery_days: res.delivery_days,
                      meal_types: res.number_of_Meals,
                      snacks_count: res.number_of_Snacks,
                      plan_id: res.Plan_Type.id,
                      start_delivery_day: res.start_date,
                      bag: Number(form.value.bag),
                      cutlery: Number(form.value.cutlery),
                      code_id: Number(priceinfo?.code_id),
                      price: Number(priceinfo?.price),
                      total_price: Number(priceinfo?.grand_total),
                      location: {
                        emirate_id: form.value.emirate_id,
                        area_id: form.value.area_id,
                        property_number: '',
                        landmark: form.value.address,
                      },
                      days_count: Number(res?.number_of_Days),
                      meals_count: res.number_of_Meals.length,
                      list_days: list_days,
                    };
                    this._Store.dispatch(
                      FETCH_CHECKOUT_START({ data: checkout })
                    );
                  }
                });
            });
        }
      });
      this.fireSwal();
      this.redirectToPaymentGateway();
    }
  }

  checkout_Without_Auth(form: FormGroup) {
    if (form.valid) {
      this.cards$.pipe(takeUntil(this.destroyed$)).subscribe((cards) => {
        if (cards) {
          const list_days: ICheckoutListDay[] = [];
          cards.forEach((item) => {
            const cardItem: ICheckoutListDay = {
              day: item.day,
              date: item.date,
              meals: [],
            };
            item.meals.forEach((meal) => {
              const cartMeal: ICheckoutMeal = {
                meal_id: meal.details.id,
                main_unit: meal.details.mainDish.unit,
                side_unit: meal.details?.sideDish?.unit || 'NONE',
                max_main: meal.details.mainDish.max_meal,
                max_side: meal.details?.sideDish?.max_meal || 0,
                type: 'MEAL',
              };

              cardItem.meals.push(cartMeal);
            });

            item.snacks.forEach((meal) => {
              const cartMeal: ICheckoutMeal = {
                meal_id: meal.details.id,
                main_unit: meal.details.mainDish.unit,
                side_unit: meal.details?.sideDish?.unit || 'NONE',
                max_main: meal.details.mainDish.max_meal,
                max_side: meal.details?.sideDish?.max_meal || 0,
                type: 'SNACK',
              };

              cardItem.meals.push(cartMeal);
            });

            list_days.push(cardItem);
          });
          this.price$
            .pipe(takeUntil(this.destroyed$))
            .subscribe((priceinfo) => {
              this.subscriptionInfo$
                .pipe(takeUntil(this.destroyed$))
                .subscribe((res) => {
                  if (res) {
                    const checkout: ICheckout = {
                      delivery_days: res.delivery_days,
                      meal_types: res.number_of_Meals,
                      snacks_count: res.number_of_Snacks,
                      plan_id: res.Plan_Type.id,
                      start_delivery_day: res.start_date,
                      bag: Number(form.value.bag),
                      cutlery: Number(form.value.cutlery),
                      code_id: Number(priceinfo?.code_id),
                      price: Number(priceinfo?.price),
                      total_price: Number(priceinfo?.grand_total),
                      location: {
                        emirate_id: form.value.emirate_id,
                        area_id: form.value.area_id,
                        property_number: '',
                        landmark: form.value.address,
                      },
                      first_name: form.value.first_name,
                      last_name: form.value.last_name,
                      email: form.value.email,
                      phone_number: form.value.phone_number,
                      password: form.value.password,
                      days_count: Number(res?.number_of_Days),
                      meals_count: res.number_of_Meals.length,
                      list_days: list_days,
                    };
                    this._Store.dispatch(
                      FETCH_CHECKOUT_START({ data: checkout })
                    );
                  }
                });
            });
        }
      });

      this.fireSwal();
      this.redirectToPaymentGateway();
    }
  }

  redirectToPaymentGateway() {
    this.checkoutResponse$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      res.loading == false && this.paymentSwal.close();
      if (res.data) {
        res.status == 1 && (window.location.href = res.data);
      }else{
        if (res.message !== null && res.status == 0) {
          Swal.fire({
            icon: 'error',
            title: this.translate.currentLang == 'ar'?"أُووبس...":'Oops...',
            text: res.message,
            confirmButtonText: this.translate.currentLang == 'ar'? "حسنا":'OK',
          })
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
    this.checkoutForm.get('address')?.setValue(address.address);
    this.checkoutForm.get('emirate_id')?.setValue(address.area.state.name);
    this.checkoutForm.get('area_id')?.setValue(address.area.area_en);
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
    });
  }

  // *****************************************************Terms*****************************************************
  onCheckTermsChange(event: any) {
    event.target.checked && (this.termsModal = true);
  }
}
