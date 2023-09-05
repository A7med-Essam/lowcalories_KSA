import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IMenuState } from "./menu.reducer";

const menuFeatureSelector = createFeatureSelector<IMenuState>('menu')
export const menuSelector = createSelector(menuFeatureSelector, state => state.data)
export const menuLoadingSelector = createSelector(menuFeatureSelector, state => state.loading)


