import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IDislikeState } from "./dislike.reducer";

const dislikeFeatureSelector = createFeatureSelector<IDislikeState>('dislike')
export const dislikeSelector = createSelector(dislikeFeatureSelector, state => state.data)
export const dislikeLoadingSelector = createSelector(dislikeFeatureSelector, state => state.loading)


