import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IClinicCheckoutState, IClinicEmirateState } from "./clinic.reducer";

const clinicEmirateFeatureSelector = createFeatureSelector<IClinicEmirateState>('clinicEmirate')
export const clinicEmirateSelector = createSelector(clinicEmirateFeatureSelector, state => state.data)
export const clinicEmirateLoadingSelector = createSelector(clinicEmirateFeatureSelector, state => state.loading)


const clinicCheckoutFeatureSelector = createFeatureSelector<IClinicCheckoutState>('clinicCheckout')
export const clinicCheckoutSelector = createSelector(clinicCheckoutFeatureSelector, state => state)
