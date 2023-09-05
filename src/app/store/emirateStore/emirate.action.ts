import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import { IEmirateResponse } from "src/app/interfaces/emirate.interface";

export const FETCH_EMIRATE_START = createAction('[Emirates] FETCH_EMIRATE_START', props<{programType:string}>())
export const FETCH_EMIRATE_SUCCESS = createAction('[Emirates] FETCH_EMIRATE_SUCCESS', props<{data:IEmirateResponse[],message:string,status:number}>())
export const FETCH_EMIRATE_FAILED = createAction('[Emirates] FETCH_EMIRATE_FAILED', props<{error:HttpErrorResponse}>())
