import { createReducer,on } from "@ngrx/store";
import { ITermsResponse } from "src/app/interfaces/terms.interface";
import { IHttpResponse } from "../appStore";
import * as fromTermsActions from "./terms.action";

export interface ITermsState extends IHttpResponse {
    data: ITermsResponse[] | null;
  }
  
  const termsInitialState: ITermsState = {
    error: null,
    loading: null,
    data: null,
    message: null,
    status: null,
  };
  
  export const TermsReducer = createReducer(
    termsInitialState,
    on(fromTermsActions.FETCH_TERMS_START, (state) => ({
      ...state,
      loading: true,
      data: null,
      error: null,
      message: null,
      status: 0,
    })),
    on(fromTermsActions.FETCH_TERMS_SUCCESS, (state, action) => ({
      ...state,
      error: null,
      loading: false,
      data: action.status == 1 ? action.data : null,
      message: action.message,
      status: action.status,
    })),
    on(fromTermsActions.FETCH_TERMS_FAILED, (state, action) => ({
      ...state,
      error: action.error,
      data: null,
      loading: false,
      message: null,
      status: 0,
    }))
  );