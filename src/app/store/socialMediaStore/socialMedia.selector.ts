import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ISocialMediaState } from "./socialMedia.reducer";

const socialMediaFeatureSelector = createFeatureSelector<ISocialMediaState>('socialMedia')
export const socialMediaSelector = createSelector(socialMediaFeatureSelector, state => state.data)
export const socialMediaLoadingSelector = createSelector(socialMediaFeatureSelector, state => state.loading)


