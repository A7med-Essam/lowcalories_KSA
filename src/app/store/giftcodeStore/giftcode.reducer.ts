import { createReducer,on } from "@ngrx/store";
import { IGiftCodeResponse } from "src/app/interfaces/giftcode.interface";
import { IHttpResponse } from "../appStore";
import * as fromGiftCodeActions from "../giftcodeStore/giftcode.action";

// ===========================================================GIFTCODE==================================================================

export interface IGiftCodeState extends IHttpResponse {
  data: IGiftCodeResponse | null;
}

const giftCodeInitialState: IGiftCodeState = {
  error: null,
  loading: null,
  data: null,
  message: null,
  status: null,
};

export const GiftCodeReducer = createReducer(
  giftCodeInitialState,
  on(fromGiftCodeActions.FETCH_GIFTCODE_START, (state) => ({
    ...state,
    loading: true,
    data: null,
    error: null,
    message: null,
    status: 0,
  })),
  on(fromGiftCodeActions.FETCH_GIFTCODE_SUCCESS, (state, action) => ({
    ...state,
    error: null,
    loading: false,
    data: action.data,
    message: action.message,
    status: action.status,
  })),
  on(fromGiftCodeActions.FETCH_GIFTCODE_FAILED, (state, action) => ({
    ...state,
    error: action.error,
    data: null,
    loading: false,
    message: null,
    status: 0,
  }))
);
