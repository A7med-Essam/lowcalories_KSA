import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromNormalPlanSelector from 'src/app/store/normalPlanStore/normalPlan.selector';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import {
  ICheckout,
  INormalPlanResponse,
  INormalProgramPriceResponse,
  IShowMealsResponse,
  ISubscriptionData,
} from 'src/app/interfaces/normal-plan.interface';
import { ILoginState } from 'src/app/store/authStore/auth.reducer';
import { loginSelector } from 'src/app/store/authStore/auth.selector';
import {
  FETCH_CHECKOUT_START,
} from 'src/app/store/normalPlanStore/normalPlan.action';
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
import { giftCodeLoadingSelector, giftCodeSelector } from 'src/app/store/giftcodeStore/giftcode.selector';
import { FETCH_GIFTCODE_START } from 'src/app/store/giftcodeStore/giftcode.action';
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
  price$: Observable<INormalProgramPriceResponse | null> = of(null);
  giftcodeButtonMode$: Observable<boolean | null> = of(false);
  emirates$!: Observable<IEmirateResponse[] | any>;
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
  areas:any[] = ["Gada","El-Dmam"]

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
          this.program_id = res.program_id;
          this.subscriptionInfo$ = _Store.select(
            fromNormalPlanSelector.normalSubscriptionSelector
          );
          this.ProgramDetails = this._Store.select(
            fromNormalPlanSelector.normalPlanSelector
          );
          this._Store.select(
            fromNormalPlanSelector.normalPlanSelector
          ).pipe(takeUntil(this.destroyed$)).subscribe(res=>{
            if (res) {
              // this._Store.dispatch(FETCH_EMIRATE_START({programType:res[0].myprogram.company}));
            }
          })

          this._Store.dispatch(FETCH_USERADDRESS_START());
          this._Store.dispatch(FETCH_TERMS_START());
          this.emirates$ = this._Store.select(emirateSelector);
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
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      phone_number: new FormControl(null, [Validators.required,Validators.pattern('^[\\d]{10}$')]),
      address: new FormControl(null, [Validators.required]),
      landline: new FormControl(null, [Validators.required]),
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
        meal_backend_types: sub?.meal_types,
        no_snacks: sub?.no_snacks,
        program_id: sub?.program_id,
        plan_option_id: sub?.plan_option_id,
        start_date: sub?.start_date,
        bag: Number(form.value.bag),
        cutlery: Number(form.value.cutlery),
        code_id: priceinfo?.code_id,
        price: priceinfo?.price,
        total_price: priceinfo?.grand_total,
        location: {
          emirate_id: form.value.emirate_id,
          area_id: form.value.area_id,
          property_number: '',
          landmark: form.value.address,
        },
        subscription_days:sub?.subscription_days,
        subscription_from:'web',
        address_id:form.value.emirate_id,
        list_days:this.userMeals ? this.userMeals : []
      };
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
        meal_backend_types: sub?.meal_types,
        no_snacks: sub?.no_snacks,
        program_id: sub?.program_id,
        plan_option_id: sub?.plan_option_id,
        start_date: sub?.start_date,
        bag: Number(form.value.bag),
        cutlery: Number(form.value.cutlery),
        code_id: priceinfo?.code_id,
        price: priceinfo?.price,
        total_price: priceinfo?.grand_total,
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
        subscription_days:sub?.subscription_days,
        subscription_from:'web',
        address_id:form.value.emirate_id,
        list_days:this.userMeals ? this.userMeals : []
      };
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

  displayUserAddressModal(){
    this.addresses$
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res=>{
      if (res == null) {
        this._Store.dispatch(FETCH_USERADDRESS_START());
      }
    })
    this.addressesModal = true
  }

  selectAddress(address: IAddressResponse) {
    this.checkoutForm.get('address')?.setValue(address.address);
    this.checkoutForm.get('emirate_id')?.setValue(address.id);
    this.checkoutForm.get('area_id')?.setValue(address.area.area_en);
    this.addressesModal = false;
  }

  // *****************************************************Swal && Lottie*****************************************************
  paymentSwal:any;
  fireSwal(){
    this.paymentSwal = Swal.mixin({
      showConfirmButton: false,
      timerProgressBar: false,
    });

    this.paymentSwal.fire({
      html: this.lottie.nativeElement,
    });
  }

  // *****************************************************Terms*****************************************************
  onCheckTermsChange(event: any){
    event.target.checked && (this.termsModal = true)
  }
}