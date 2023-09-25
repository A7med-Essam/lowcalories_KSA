import { createReducer,on } from "@ngrx/store";
import { socialMedia } from "src/app/services/contacts.service";
import { IHttpResponse } from "../appStore";
import * as fromsocialMediaActions from "./socialMedia.action";

export interface ISocialMediaState extends IHttpResponse {
    data: socialMedia[] | null;
  }
  
  const socialMediaInitialState: ISocialMediaState = {
    error: null,
    loading: null,
    data: null,
    message: null,
    status: null,
  };
  
  export const socialMediaReducer = createReducer(
    socialMediaInitialState,
    on(fromsocialMediaActions.FETCH_SOCIAL_MEDIA_START, (state) => ({
      ...state,
      loading: true,
      data: null,
      error: null,
      message: null,
      status: 0,
    })),
    on(fromsocialMediaActions.FETCH_SOCIAL_MEDIA_SUCCESS, (state, action) => ({
      ...state,
      error: null,
      loading: false,
      data: action.status == 1 ? action.data : null,
      message: action.message,
      status: action.status,
    })),
    on(fromsocialMediaActions.FETCH_SOCIAL_MEDIA_FAILED, (state, action) => ({
      ...state,
      error: action.error,
      data: null,
      loading: false,
      message: null,
      status: 0,
    }))
  );