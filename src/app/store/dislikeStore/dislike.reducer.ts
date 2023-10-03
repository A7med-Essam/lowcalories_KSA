import { createReducer,on } from "@ngrx/store";
import { IDislikeResponse } from "src/app/interfaces/dislike.interface";
import { IHttpResponse } from "../appStore";
import * as fromDislikeActions from "./dislike.action";

export interface IDislikeState extends IHttpResponse {
    data: IDislikeResponse[] | null;
  }
  
  const dislikeInitialState: IDislikeState = {
    error: null,
    loading: null,
    data: null,
    message: null,
    status: null,
  };
  
  export const DislikeReducer = createReducer(
    dislikeInitialState,
    on(fromDislikeActions.FETCH_DISLIKE_START, (state) => ({
      ...state,
      loading: true,
      data: null,
      error: null,
      message: null,
      status: 0,
    })),
    on(fromDislikeActions.FETCH_DISLIKE_SUCCESS, (state, action) => ({
      ...state,
      error: null,
      loading: false,
      data: action.status == 1 ? action.data : null,
      message: action.message,
      status: action.status,
    })),
    on(fromDislikeActions.FETCH_DISLIKE_FAILED, (state, action) => ({
      ...state,
      error: action.error,
      data: null,
      loading: false,
      message: null,
      status: 0,
    }))
  );