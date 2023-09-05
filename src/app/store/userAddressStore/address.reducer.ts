import { createReducer,on } from "@ngrx/store";
import { IAddressResponse } from "src/app/interfaces/address.interface";
import { IHttpResponse } from "../appStore";
import * as fromAddressActions from "./address.action";

export interface IAddresseState extends IHttpResponse {
    data: IAddressResponse[] | null;
  }
  
  const addressInitialState: IAddresseState = {
    error: null,
    loading: null,
    data: null,
    message: null,
    status: null,
  };
  
  export const AddressReducer = createReducer(
    addressInitialState,
    on(fromAddressActions.FETCH_USERADDRESS_START, (state) => ({
      ...state,
      loading: true,
      data: null,
      error: null,
      message: null,
      status: 0,
    })),
    on(fromAddressActions.FETCH_USERADDRESS_SUCCESS, (state, action) => ({
      ...state,
      error: null,
      loading: false,
      data: action.status == 1 ? action.data : null,
      message: action.message,
      status: action.status,
    })),
    on(fromAddressActions.FETCH_USERADDRESS_FAILED, (state, action) => ({
      ...state,
      error: action.error,
      data: null,
      loading: false,
      message: null,
      status: 0,
    }))
  );