import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import { ICheckout, INormalPlanResponse, INormalProgramPriceResponse, INormalSubscriptionPrice, IShowMealsResponse, ISubscriptionData } from "src/app/interfaces/normal-plan.interface";

export const FETCH_NORMALPLAN_START = createAction('[Normal Plan] FETCH_NORMALPLAN_START', props<{program_id:number}>())
export const FETCH_NORMALPLAN_SUCCESS = createAction('[Normal Plan] FETCH_NORMALPLAN_SUCCESS', props<{data:INormalPlanResponse,message:string,status:number}>())
export const FETCH_NORMALPLAN_FAILED = createAction('[Normal Plan] FETCH_NORMALPLAN_FAILED', props<{error:HttpErrorResponse}>())
export const SAVE_NORMAL_SUBSCRIPTION = createAction('[Normal Plan] SAVE_NORMAL_SUBSCRIPTION', props<{data:ISubscriptionData}>())


export const FETCH_SHOWMEALS_START = createAction('[Normal Plan] FETCH_SHOWMEALS_START', props<{data:ISubscriptionData}>())
export const FETCH_SHOWMEALS_SUCCESS = createAction('[Normal Plan] FETCH_SHOWMEALS_SUCCESS', props<{data:IShowMealsResponse[],message:string,status:number}>())
export const FETCH_SHOWMEALS_FAILED = createAction('[Normal Plan] FETCH_SHOWMEALS_FAILED', props<{error:HttpErrorResponse}>())

export const FETCH_NORMALPLAN_PRICE_START = createAction('[Normal Plan] FETCH_NORMALPLAN_PRICE_START', props<{data:INormalSubscriptionPrice}>())
export const FETCH_NORMALPLAN_PRICE_SUCCESS = createAction('[Normal Plan] FETCH_NORMALPLAN_PRICE_SUCCESS', props<{data:INormalProgramPriceResponse,message:string,status:number}>())
export const FETCH_NORMALPLAN_PRICE_FAILED = createAction('[Normal Plan] FETCH_NORMALPLAN_PRICE_FAILED', props<{error:HttpErrorResponse}>())

export const FETCH_CHECKOUT_START = createAction('[Normal Plan] FETCH_CHECKOUT_START', props<{data:ICheckout}>())
export const FETCH_CHECKOUT_SUCCESS = createAction('[Normal Plan] FETCH_CHECKOUT_SUCCESS', props<{data:string,message:string,status:number}>())
export const FETCH_CHECKOUT_FAILED = createAction('[Normal Plan] FETCH_CHECKOUT_FAILED', props<{error:HttpErrorResponse}>())