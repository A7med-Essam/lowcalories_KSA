import { createReducer,on } from "@ngrx/store";
import { IEmirateAppointmentsResponse } from "src/app/interfaces/clinic.interface";
import { IHttpResponse } from "../appStore";
import * as fromClinicActions from "./clinic.action";

export interface IClinicEmirateState extends IHttpResponse {
    data: IEmirateAppointmentsResponse[] | null;
  }
  
  const clinicEmirateInitialState: IClinicEmirateState = {
    error: null,
    loading: null,
    data: null,
    message: null,
    status: null,
  };
  
  export const ClinicEmirateReducer = createReducer(
    clinicEmirateInitialState,
    on(fromClinicActions.FETCH_CLINIC_EMIRATES_START, (state) => ({
      ...state,
      loading: true,
      data: null,
      error: null,
      message: null,
      status: 0,
    })),
    on(fromClinicActions.FETCH_CLINIC_EMIRATES_SUCCESS, (state, action) => ({
      ...state,
      error: null,
      loading: false,
      data: action.status == 1 ? action.data : null,
      message: action.message,
      status: action.status,
    })),
    on(fromClinicActions.FETCH_CLINIC_EMIRATES_FAILED, (state, action) => ({
      ...state,
      error: action.error,
      data: null,
      loading: false,
      message: null,
      status: 0,
    }))
  );

// ========================================================== Checkout

export interface IClinicCheckoutState extends IHttpResponse {
  data: string | null;
}

const clinicCheckoutInitialState: IClinicCheckoutState = {
  error: null,
  loading: null,
  data: null,
  message: null,
  status: null,
};

export const ClinicCheckoutReducer = createReducer(
  clinicCheckoutInitialState,
  on(fromClinicActions.FETCH_CLINIC_CHECKOUT_START, (state) => ({
    ...state,
    loading: true,
    data: null,
    error: null,
    message: null,
    status: 0,
  })),
  on(fromClinicActions.FETCH_CLINIC_CHECKOUT_SUCCESS, (state, action) => ({
    ...state,
    error: null,
    loading: false,
    data: action.status == 1 ? action.data : null,
    message: action.message,
    status: action.status,
  })),
  on(fromClinicActions.FETCH_CLINIC_CHECKOUT_FAILED, (state, action) => ({
    ...state,
    error: action.error,
    data: null,
    loading: false,
    message: null,
    status: 0,
  }))
);