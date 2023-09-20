import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import { IStateResponse } from "src/app/interfaces/state.interface";

export const FETCH_STATE_START = createAction('[States] FETCH_STATE_START')
export const FETCH_STATE_SUCCESS = createAction('[States] FETCH_STATE_SUCCESS', props<{data:IStateResponse[],message:string,status:number}>())
export const FETCH_STATE_FAILED = createAction('[States] FETCH_STATE_FAILED', props<{error:HttpErrorResponse}>())
