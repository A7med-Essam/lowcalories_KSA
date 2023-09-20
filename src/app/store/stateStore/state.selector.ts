import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from './state.reducer';

const stateFeatureSelector = createFeatureSelector<IState>('state');
export const stateSelector = createSelector(
  stateFeatureSelector,
  (state) => state.data
);
export const stateLoadingSelector = createSelector(
  stateFeatureSelector,
  (state) => state.loading
);
