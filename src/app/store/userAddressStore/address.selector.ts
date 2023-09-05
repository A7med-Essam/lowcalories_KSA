import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IAddresseState } from "./address.reducer";

const addressFeatureSelector = createFeatureSelector<IAddresseState>('address')
export const addressSelector = createSelector(addressFeatureSelector, state => state.data)
export const addressLoadingSelector = createSelector(addressFeatureSelector, state => state.loading)


