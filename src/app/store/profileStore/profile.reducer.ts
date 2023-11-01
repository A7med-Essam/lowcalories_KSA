import { createReducer,on } from "@ngrx/store";
import { IHttpResponse } from "../appStore";
import * as fromProfileActions from "./profile.action";

export interface IProfileReplacementState extends IHttpResponse {
    data: fromProfileActions.ProfileMealsResponse[] | null;
  }
  
  const profileReplacementMealState: IProfileReplacementState = {
    error: null,
    loading: null,
    data: null,
    message: null,
    status: null,
  };
  
  export const ProfileReplacementMealReducer = createReducer(
    profileReplacementMealState,
    on(fromProfileActions.FETCH_PROFILE_REPLACEMENT_MEALS_START, (state) => ({
      ...state,
      loading: true,
      data: null,
      error: null,
      message: null,
      status: 0,
    })),
    on(fromProfileActions.FETCH_PROFILE_REPLACEMENT_MEALS_SUCCESS, (state, action) => ({
      ...state,
      error: null,
      loading: false,
      data: action.status == 1 ? action.data : null,
      message: action.message,
      status: action.status,
    })),
    on(fromProfileActions.FETCH_PROFILE_REPLACEMENT_MEALS_FAILED, (state, action) => ({
      ...state,
      error: action.error,
      data: null,
      loading: false,
      message: null,
      status: 0,
    }))
  );

// =======================================================CHANGE MEAL =================================================================
export interface IProfileChangeState extends IHttpResponse {
  data: fromProfileActions.IRequestChangeMealResponse | null;
}

const profileChangeMealState: IProfileChangeState = {
  error: null,
  loading: null,
  data: null,
  message: null,
  status: null,
};

export const ProfileChangeMealReducer = createReducer(
  profileChangeMealState,
  on(fromProfileActions.FETCH_PROFILE_CHANGE_MEALS_START, (state) => ({
    ...state,
    loading: true,
    data: null,
    error: null,
    message: null,
    status: 0,
  })),
  on(fromProfileActions.FETCH_PROFILE_CHANGE_MEALS_SUCCESS, (state, action) => ({
    ...state,
    error: null,
    loading: false,
    data: action.status == 1 ? action.data : null,
    message: action.message,
    status: action.status,
  })),
  on(fromProfileActions.FETCH_PROFILE_CHANGE_MEALS_FAILED, (state, action) => ({
    ...state,
    error: action.error,
    data: null,
    loading: false,
    message: null,
    status: 0,
  }))
);