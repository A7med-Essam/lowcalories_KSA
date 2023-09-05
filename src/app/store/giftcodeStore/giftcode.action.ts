import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import { IGiftCodeData, IGiftCodeResponse } from "src/app/interfaces/giftcode.interface";

export const FETCH_GIFTCODE_START = createAction('[Gift Code] FETCH_GIFTCODE_START', props<{data:IGiftCodeData}>())
export const FETCH_GIFTCODE_SUCCESS = createAction('[Gift Code] FETCH_GIFTCODE_SUCCESS', props<{data:IGiftCodeResponse,message:string,status:number}>())
export const FETCH_GIFTCODE_FAILED = createAction('[Gift Code] FETCH_GIFTCODE_FAILED', props<{error:HttpErrorResponse}>())
