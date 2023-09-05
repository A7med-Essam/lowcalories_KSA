import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IEmirateState } from "./emirate.reducer";

const emirateFeatureSelector = createFeatureSelector<IEmirateState>('emirate')
export const emirateSelector = createSelector(emirateFeatureSelector, state => state.data)
export const emirateLoadingSelector = createSelector(emirateFeatureSelector, state => state.loading)


