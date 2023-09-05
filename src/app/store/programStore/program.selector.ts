import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IProgramState } from "./program.reducer";

const programsFeatureSelector = createFeatureSelector<IProgramState>('programs')
export const programSelector = createSelector(programsFeatureSelector, state => state.data)
export const programLoadingSelector = createSelector(programsFeatureSelector, state => state.loading)


