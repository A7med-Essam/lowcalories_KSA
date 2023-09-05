import { createReducer,on } from "@ngrx/store";
import { IEmirateResponse } from "src/app/interfaces/emirate.interface";
import { IHttpResponse } from "../appStore";
import * as fromEmirateActions from "./emirate.action";

export interface IEmirateState extends IHttpResponse {
    data: IEmirateResponse[] | null;
  }
  
  const emirateInitialState: IEmirateState = {
    error: null,
    loading: null,
    data: null,
    message: null,
    status: null,
  };
  
  export const EmirateReducer = createReducer(
    emirateInitialState,
    on(fromEmirateActions.FETCH_EMIRATE_START, (state) => ({
      ...state,
      loading: true,
      data: null,
      error: null,
      message: null,
      status: 0,
    })),
    on(fromEmirateActions.FETCH_EMIRATE_SUCCESS, (state, action) => ({
      ...state,
      error: null,
      loading: false,
      data: action.status == 1 ? action.data : null,
      message: action.message,
      status: action.status,
    })),
    on(fromEmirateActions.FETCH_EMIRATE_FAILED, (state, action) => ({
      ...state,
      error: action.error,
      data: null,
      loading: false,
      message: null,
      status: 0,
    }))
  );