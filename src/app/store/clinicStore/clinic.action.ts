import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import { IClinicCheckout, IEmirateAppointmentsResponse } from "src/app/interfaces/clinic.interface";

export const FETCH_CLINIC_EMIRATES_START = createAction('[Clinic] FETCH_CLINIC_EMIRATES_START')
export const FETCH_CLINIC_EMIRATES_SUCCESS = createAction('[Clinic] FETCH_CLINIC_EMIRATES_SUCCESS', props<{data:IEmirateAppointmentsResponse[],message:string,status:number}>())
export const FETCH_CLINIC_EMIRATES_FAILED = createAction('[Clinic] FETCH_CLINIC_EMIRATES_FAILED', props<{error:HttpErrorResponse}>())

export const FETCH_CLINIC_CHECKOUT_START = createAction('[Clinic] FETCH_CLINIC_CHECKOUT_START', props<{data:IClinicCheckout}>())
export const FETCH_CLINIC_CHECKOUT_SUCCESS = createAction('[Clinic] FETCH_CLINIC_CHECKOUT_SUCCESS', props<{data:string,message:string,status:number}>())
export const FETCH_CLINIC_CHECKOUT_FAILED = createAction('[Clinic] FETCH_CLINIC_CHECKOUT_FAILED', props<{error:HttpErrorResponse}>())
