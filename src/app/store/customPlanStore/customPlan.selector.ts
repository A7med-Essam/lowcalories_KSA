import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ICheckoutState, ICustomCardsState, ICustomPlanPriceState, ICustomPlanState, ICustomShowCategoriesState, ICustomShowMealsState, ICustomSubscriptionState } from "./customPlan.reducer";

const customPlanFeatureSelector = createFeatureSelector<ICustomPlanState>('customPlan')
export const customPlanSelector = createSelector(customPlanFeatureSelector, state => state.data)
export const customPlanLoadingSelector = createSelector(customPlanFeatureSelector, state => state.loading)

const CustomSubscriptionFeatureSelector = createFeatureSelector<ICustomSubscriptionState>('customSubscription')
export const CustomSubscriptionSelector = createSelector(CustomSubscriptionFeatureSelector, state => state.data)

const showMealsFeatureSelector = createFeatureSelector<ICustomShowMealsState>('customShowMeals')
export const showMealsSelector = createSelector(showMealsFeatureSelector, state => state.data)
export const showMealsLoadingSelector = createSelector(showMealsFeatureSelector, state => state.loading)

const showCategoriesFeatureSelector = createFeatureSelector<ICustomShowCategoriesState>('customShowCategories')
export const showCategoriesSelector = createSelector(showCategoriesFeatureSelector, state => state.data)
export const showCategoriesLoadingSelector = createSelector(showCategoriesFeatureSelector, state => state.loading)

const CustomCardsFeatureSelector = createFeatureSelector<ICustomCardsState>('cards')
export const CustomCardsSelector = createSelector(CustomCardsFeatureSelector, state => state.data)

const customPlanPriceFeatureSelector = createFeatureSelector<ICustomPlanPriceState>('customPlanPrice')
export const customPlanPriceSelector = createSelector(customPlanPriceFeatureSelector, state => state.data)
export const customPlanPriceLoadingSelector = createSelector(customPlanPriceFeatureSelector, state => state.loading)

const customPlanCheckoutFeatureSelector = createFeatureSelector<ICheckoutState>('customCheckout')
export const customPlanCheckoutSelector = createSelector(customPlanCheckoutFeatureSelector, state => state.data)
export const customPlanCheckoutLoadingSelector = createSelector(customPlanCheckoutFeatureSelector, state => state.loading)
export const customPlanResponseSelector = createSelector(customPlanCheckoutFeatureSelector, state => state)