import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import { ICards, ICategoriesResponse, ICheckout, ICustomMealsResponse, ICustomPlanResponse, ICustomProgramPriceResponse, ICustomSubscriptionPrice, ISubscriptionData } from "src/app/interfaces/custom-plan.interface";

export const FETCH_CUSTOMPLAN_START = createAction('[Custom Plan] FETCH_CUSTOMPLAN_START', props<{program_id:number}>())
export const FETCH_CUSTOMPLAN_SUCCESS = createAction('[Custom Plan] FETCH_CUSTOMPLAN_SUCCESS', props<{data:ICustomPlanResponse[],message:string,status:number}>())
export const FETCH_CUSTOMPLAN_FAILED = createAction('[Custom Plan] FETCH_CUSTOMPLAN_FAILED', props<{error:HttpErrorResponse}>())

export const SAVE_CUSTOM_SUBSCRIPTION = createAction('[Custom Plan] SAVE_CUSTOM_SUBSCRIPTION', props<{data:ISubscriptionData}>())

export const FETCH_CUSTOMPLAN_SHOWCATEGORIES_START = createAction('[Custom Plan] FETCH_CUSTOMPLAN_SHOWCATEGORIES_START', props<{plan_id:number}>())
export const FETCH_CUSTOMPLAN_SHOWCATEGORIES_SUCCESS = createAction('[Custom Plan] FETCH_CUSTOMPLAN_SHOWCATEGORIES_SUCCESS', props<{data:ICategoriesResponse[],message:string,status:number}>())
export const FETCH_CUSTOMPLAN_SHOWCATEGORIES_FAILED = createAction('[Custom Plan] FETCH_CUSTOMPLAN_SHOWCATEGORIES_FAILED', props<{error:HttpErrorResponse}>())

export const FETCH_CUSTOMPLAN_SHOWMEALS_START = createAction('[Custom Plan] FETCH_CUSTOMPLAN_SHOWMEALS_START', props<{plan_id:number}>())
export const FETCH_CUSTOMPLAN_SHOWMEALS_SUCCESS = createAction('[Custom Plan] FETCH_CUSTOMPLAN_SHOWMEALS_SUCCESS', props<{data:ICustomMealsResponse[],message:string,status:number}>())
export const FETCH_CUSTOMPLAN_SHOWMEALS_FAILED = createAction('[Custom Plan] FETCH_CUSTOMPLAN_SHOWMEALS_FAILED', props<{error:HttpErrorResponse}>())

export const SAVE_CUSTOMPLAN_CARDS = createAction('[Custom Plan] SAVE_CUSTOMPLAN_CARDS', props<{data:ICards[]}>())

export const FETCH_CUSTOMPLAN_PRICE_START = createAction('[Custom Plan] FETCH_CUSTOMPLAN_PRICE_START', props<{data:ICustomSubscriptionPrice}>())
export const FETCH_CUSTOMPLAN_PRICE_SUCCESS = createAction('[Custom Plan] FETCH_CUSTOMPLAN_PRICE_SUCCESS', props<{data:ICustomProgramPriceResponse,message:string,status:number}>())
export const FETCH_CUSTOMPLAN_PRICE_FAILED = createAction('[Custom Plan] FETCH_CUSTOMPLAN_PRICE_FAILED', props<{error:HttpErrorResponse}>())

export const FETCH_CHECKOUT_START = createAction('[Custom Plan] FETCH_CHECKOUT_START', props<{data:ICheckout}>())
export const FETCH_CHECKOUT_SUCCESS = createAction('[Custom Plan] FETCH_CHECKOUT_SUCCESS', props<{data:string,message:string,status:number}>())
export const FETCH_CHECKOUT_FAILED = createAction('[Custom Plan] FETCH_CHECKOUT_FAILED', props<{error:HttpErrorResponse}>())