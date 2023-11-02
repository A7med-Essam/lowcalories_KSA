import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import { IReplacement } from "src/app/interfaces/normal-plan.interface";

export const FETCH_PROFILE_REPLACEMENT_MEALS_START = createAction('[Profile] FETCH_PROFILE_REPLACEMENT_MEALS_START', props<{data:ProfileMeal[]}>())
export const FETCH_PROFILE_REPLACEMENT_MEALS_SUCCESS = createAction('[Profile] FETCH_PROFILE_REPLACEMENT_MEALS_SUCCESS', props<{data:ProfileMealsResponse[],message:string,status:number}>())
export const FETCH_PROFILE_REPLACEMENT_MEALS_FAILED = createAction('[Profile] FETCH_PROFILE_REPLACEMENT_MEALS_FAILED', props<{error:HttpErrorResponse}>())

export const FETCH_PROFILE_CHANGE_MEALS_START = createAction('[Profile] FETCH_PROFILE_CHANGE_MEALS_START', props<{data:IRequestChangeMeal}>())
export const FETCH_PROFILE_CHANGE_MEALS_SUCCESS = createAction('[Profile] FETCH_PROFILE_CHANGE_MEALS_SUCCESS', props<{data:IRequestChangeMealResponse,message:string,status:number}>())
export const FETCH_PROFILE_CHANGE_MEALS_FAILED = createAction('[Profile] FETCH_PROFILE_CHANGE_MEALS_FAILED', props<{error:HttpErrorResponse}>())

export interface ProfileMeal {
    deliveryDate:string;
    mealName:string;
    sub_detail_id:number;
}

export interface ProfileMealsResponse {
    meal_name:         string;
    image:             string;
    meal_status:       null;
    meal_native:       null;
    meal_native_image: string;
    meal_replacements: IReplacement[];
}

export interface IRequestChangeMeal{
    subscrbtionId:number;
    paymentsDetailsId: number;
    mealTypeId:number;
    subDetail_id:number;
    mealName:string;
    typeName:string;
    changed_meal:string;
    planName:string;
    deliveryDate:string;
    changed_meal_without_grams:string;
    planTitle:string;
    from:string;
}

export interface IRequestChangeMealResponse {
    subscrbtionId:              number;
    paymentsDetailsId:              number;
    subDetail_id:               number;
    user_id:                    number;
    planTitle:                  string;
    planName:                   string;
    deliveryDate:               Date;
    mealTypeId:                 number;
    mealName:                   string;
    typeName:                   string;
    changed_meal:               string;
    from:                       string;
    changed_meal_id:            number;
    changed_meal_without_grams: string;
    id:                         number;
}
