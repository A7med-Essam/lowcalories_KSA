import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IGiftCodeState } from "./giftcode.reducer";


const giftCodeFeatureSelector = createFeatureSelector<IGiftCodeState>('giftCode')
export const giftCodeSelector = createSelector(giftCodeFeatureSelector, state => state.data)
export const giftCodeLoadingSelector = createSelector(giftCodeFeatureSelector, state => state.loading)

