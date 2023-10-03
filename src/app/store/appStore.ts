import { HttpErrorResponse } from '@angular/common/http';
import { ActionReducerMap } from '@ngrx/store';
import * as fromAuthStore from './authStore/auth.reducer';
import * as fromProgramStore from './programStore/program.reducer';
import * as fromNormalPlanStore from './normalPlanStore/normalPlan.reducer';
import * as fromCustomPlanStore from './customPlanStore/customPlan.reducer';
import * as fromStateStore from './stateStore/state.reducer';
import * as fromAddressStore from './userAddressStore/address.reducer';
import * as fromTermsStore from './termsStore/terms.reducer';
import * as fromDislikeStore from './dislikeStore/dislike.reducer';
import * as fromClinicStore from './clinicStore/clinic.reducer';
import * as fromGiftcodeStore from './giftcodeStore/giftcode.reducer';
import * as fromSocialMediaStore from './socialMediaStore/socialMedia.reducer';
import * as fromMenuStore from './menuStore/menu.reducer';

import { AuthEffect } from './authStore/auth.effect';
import { ProgramEffects } from './programStore/program.effect';
import { GiftcodeEffects } from './giftcodeStore/giftcode.effect';
import { NormalPlanEffects } from './normalPlanStore/normalPlan.effect';
import { CustomPlanEffects } from './customPlanStore/customPlan.effect';
import { StateEffects } from './stateStore/state.effect';
import { AddressEffects } from './userAddressStore/address.effect';
import { TermsEffects } from './termsStore/terms.effect';
import { ClinicEffects } from './clinicStore/clinic.effect';
import { MenuEffects } from './menuStore/menu.effect';
import { SocialMediaEffects } from './socialMediaStore/socialMedia.effect';
import { DislikeEffects } from './dislikeStore/dislike.effect';

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
  state: fromStateStore.IState;
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
  menu: fromMenuStore.IMenuState;
  socialMedia: fromSocialMediaStore.ISocialMediaState
  dislike: fromDislikeStore.IDislikeState
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
  state: fromStateStore.StateReducer,
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
  menu: fromMenuStore.MenuReducer,
  socialMedia: fromSocialMediaStore.socialMediaReducer,
  dislike: fromDislikeStore.DislikeReducer
};

export const APP_EFFECTS = [
  AuthEffect,
  ProgramEffects,
  NormalPlanEffects,
  CustomPlanEffects,
  StateEffects,
  AddressEffects,
  TermsEffects,
  ClinicEffects,
  GiftcodeEffects,
  MenuEffects,
  SocialMediaEffects,
  DislikeEffects
];

export interface IHttpResponse {
  loading: boolean | null;
  error: HttpErrorResponse | null;
  status: number | null;
  message: string | null;
}
