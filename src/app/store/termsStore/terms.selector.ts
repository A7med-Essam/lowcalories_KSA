import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ITermsState } from "./terms.reducer";

const termsFeatureSelector = createFeatureSelector<ITermsState>('terms')
export const termsSelector = createSelector(termsFeatureSelector, state => state.data)
export const termsLoadingSelector = createSelector(termsFeatureSelector, state => state.loading)


