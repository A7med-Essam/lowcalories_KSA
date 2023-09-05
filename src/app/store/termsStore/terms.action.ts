import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import { ITermsResponse } from "src/app/interfaces/terms.interface";

export const FETCH_TERMS_START = createAction('[Terms] FETCH_TERMS_START')
export const FETCH_TERMS_SUCCESS = createAction('[Terms] FETCH_TERMS_SUCCESS', props<{data:ITermsResponse[],message:string,status:number}>())
export const FETCH_TERMS_FAILED = createAction('[Terms] FETCH_TERMS_FAILED', props<{error:HttpErrorResponse}>())
