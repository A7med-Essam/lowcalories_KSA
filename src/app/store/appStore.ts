import { HttpErrorResponse } from '@angular/common/http';
import { ActionReducerMap } from '@ngrx/store';
import { AuthEffect } from './authStore/auth.effect';
import { ProgramEffects } from './programStore/program.effect';
import * as fromAuthStore from './authStore/auth.reducer';
import * as fromProgramStore from './programStore/program.reducer';
import * as fromNormalPlanStore from './normalPlanStore/normalPlan.reducer';
import * as fromCustomPlanStore from './customPlanStore/customPlan.reducer';
import * as fromEmirateStore from './emirateStore/emirate.reducer';
import * as fromAddressStore from './userAddressStore/address.reducer';
import * as fromTermsStore from './termsStore/terms.reducer';
import * as fromClinicStore from './clinicStore/clinic.reducer';
import * as fromGiftcodeStore from './giftcodeStore/giftcode.reducer';
import { GiftcodeEffects } from './giftcodeStore/giftcode.effect';
import { NormalPlanEffects } from './normalPlanStore/normalPlan.effect';
import { CustomPlanEffects } from './customPlanStore/customPlan.effect';
import { EmirateEffects } from './emirateStore/emirate.effect';
import { AddressEffects } from './userAddressStore/address.effect';
import { TermsEffects } from './termsStore/terms.effect';
import { ClinicEffects } from './clinicStore/clinic.effect';
import { MenuEffects } from './menuStore/menu.effect';
import * as fromMenuStore from './menuStore/menu.reducer';

export interface AppState {
  login: fromAuthStore.ILoginState;
  register: fromAuthStore.IRegisterState;
  programs: fromProgramStore.IProgramState;
  normalPlan: fromNormalPlanStore.INormalPlanState;
  normalShowMeals: fromNormalPlanStore.IShowMealsState;
  customPlan: fromCustomPlanStore.ICustomPlanState;
  customSubscription: fromCustomPlanStore.ICustomSubscriptionState;
  normalSubscription: fromNormalPlanStore.INormalSubscriptionState;
  normalSubscriptionMeals: fromNormalPlanStore.INormalSubscriptionMealsState;
  normalPlanPrice: fromNormalPlanStore.INormalPlanPriceState;
  emirate: fromEmirateStore.IEmirateState;
  normalCheckout: fromNormalPlanStore.ICheckoutState;
  address: fromAddressStore.IAddresseState;
  terms: fromTermsStore.ITermsState;
  clinicEmirate: fromClinicStore.IClinicEmirateState;
  clinicCheckout: fromClinicStore.IClinicCheckoutState;
  customShowMeals: fromCustomPlanStore.ICustomShowMealsState;
  customShowCategories: fromCustomPlanStore.ICustomShowCategoriesState;
  cards: fromCustomPlanStore.ICustomCardsState;
  customPlanPrice: fromCustomPlanStore.ICustomPlanPriceState;
  customCheckout: fromCustomPlanStore.ICheckoutState;
  giftCode: fromGiftcodeStore.IGiftCodeState;
  menu:fromMenuStore.IMenuState
}

export const APP_STORE: ActionReducerMap<AppState> = {
  login: fromAuthStore.LoginReducer,
  register: fromAuthStore.RegisterReducer,
  programs: fromProgramStore.ProgramReducer,
  normalPlan: fromNormalPlanStore.NormalPlanReducer,
  normalShowMeals: fromNormalPlanStore.ShowMealsReducer,
  customPlan: fromCustomPlanStore.CustomPlanReducer,
  customSubscription: fromCustomPlanStore.CustomSubscriptionReducer,
  normalSubscription: fromNormalPlanStore.NormalSubscriptionReducer,
  normalSubscriptionMeals: fromNormalPlanStore.NormalSubscriptionMealsReducer,
  normalPlanPrice: fromNormalPlanStore.NormalPlanPriceReducer,
  emirate: fromEmirateStore.EmirateReducer,
  normalCheckout: fromNormalPlanStore.NormalPlanCheckoutReducer,
  address: fromAddressStore.AddressReducer,
  terms: fromTermsStore.TermsReducer,
  clinicEmirate: fromClinicStore.ClinicEmirateReducer,
  clinicCheckout: fromClinicStore.ClinicCheckoutReducer,
  customShowMeals: fromCustomPlanStore.ShowMealsReducer,
  customShowCategories: fromCustomPlanStore.ShowCategoriesReducer,
  cards: fromCustomPlanStore.CustomCardsReducer,
  customPlanPrice: fromCustomPlanStore.CustomPlanPriceReducer,
  customCheckout: fromCustomPlanStore.CustomPlanCheckoutReducer,
  giftCode: fromGiftcodeStore.GiftCodeReducer,
  menu:fromMenuStore.MenuReducer
};

export const APP_EFFECTS = [
  AuthEffect,
  ProgramEffects,
  NormalPlanEffects,
  CustomPlanEffects,
  EmirateEffects,
  AddressEffects,
  TermsEffects,
  ClinicEffects,
  GiftcodeEffects,
  MenuEffects
];

export interface IHttpResponse {
  loading: boolean | null;
  error: HttpErrorResponse | null;
  status: number | null;
  message: string | null;
}
