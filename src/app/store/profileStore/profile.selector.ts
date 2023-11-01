import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IProfileChangeState, IProfileReplacementState } from "./profile.reducer";

const profileReplacementFeatureSelector = createFeatureSelector<IProfileReplacementState>('profileReplacement')
export const profileReplacementSelector = createSelector(profileReplacementFeatureSelector, state => state.data)
export const profileReplacementLoadingSelector = createSelector(profileReplacementFeatureSelector, state => state.loading)


const profileChangeMealFeatureSelector = createFeatureSelector<IProfileChangeState>('profileChangeMeal')
export const profileChangeMealSelector = createSelector(profileChangeMealFeatureSelector, state => state.data)
export const profileChangeMealLoadingSelector = createSelector(profileChangeMealFeatureSelector, state => state.loading)