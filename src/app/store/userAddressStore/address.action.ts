import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import { IAddressResponse } from "src/app/interfaces/address.interface";

export const FETCH_USERADDRESS_START = createAction('[Address] FETCH_USERADDRESS_START')
export const FETCH_USERADDRESS_SUCCESS = createAction('[Address] FETCH_USERADDRESS_SUCCESS', props<{data:IAddressResponse[],message:string,status:number}>())
export const FETCH_USERADDRESS_FAILED = createAction('[Address] FETCH_USERADDRESS_FAILED', props<{error:HttpErrorResponse}>())
