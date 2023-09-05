import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import { IMenuResponse } from "src/app/interfaces/menu.interface";

export const FETCH_MENU_START = createAction('[Menu] FETCH_MENU_START')
export const FETCH_MENU_SUCCESS = createAction('[Menu] FETCH_MENU_SUCCESS', props<{data:IMenuResponse[],message:string,status:number}>())
export const FETCH_MENU_FAILED = createAction('[Menu] FETCH_MENU_FAILED', props<{error:HttpErrorResponse}>())
