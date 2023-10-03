import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import { IDislikeResponse } from "src/app/interfaces/dislike.interface";

export const FETCH_DISLIKE_START = createAction('[Dislike] FETCH_DISLIKE_START')
export const FETCH_DISLIKE_SUCCESS = createAction('[Dislike] FETCH_DISLIKE_SUCCESS', props<{data:IDislikeResponse[],message:string,status:number}>())
export const FETCH_DISLIKE_FAILED = createAction('[Dislike] FETCH_DISLIKE_FAILED', props<{error:HttpErrorResponse}>())
