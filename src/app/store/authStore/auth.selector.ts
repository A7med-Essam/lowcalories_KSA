import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ILoginState, IRegisterState } from "./auth.reducer";

const loginFeatureSelector = createFeatureSelector<ILoginState>('login')
export const loginSelector = createSelector(loginFeatureSelector, state => state)


const registerFeatureSelector = createFeatureSelector<IRegisterState>('register')
export const registerSelector = createSelector(registerFeatureSelector, state => state)
