import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import { IProgramResponse } from "src/app/interfaces/program.interface";

export const FETCH_PROGRAM_START = createAction('[Program] FETCH_PROGRAM_START')
export const FETCH_PROGRAM_SUCCESS = createAction('[Program] FETCH_PROGRAM_SUCCESS', props<{data:IProgramResponse[],message:string,status:number}>())
export const FETCH_PROGRAM_FAILED = createAction('[Program] FETCH_PROGRAM_FAILED', props<{error:HttpErrorResponse}>())
