import { createReducer,on } from "@ngrx/store";
import { IMenuResponse } from "src/app/interfaces/menu.interface";
import { IHttpResponse } from "../appStore";
import * as fromMenuActions from "./menu.action";

export interface IMenuState extends IHttpResponse {
    data: IMenuResponse[] | null;
  }
  
  const menuInitialState: IMenuState = {
    error: null,
    loading: null,
    data: null,
    message: null,
    status: null,
  };
  
  export const MenuReducer = createReducer(
    menuInitialState,
    on(fromMenuActions.FETCH_MENU_START, (state) => ({
      ...state,
      loading: true,
      data: null,
      error: null,
      message: null,
      status: 0,
    })),
    on(fromMenuActions.FETCH_MENU_SUCCESS, (state, action) => ({
      ...state,
      error: null,
      loading: false,
      data: action.status == 1 ? action.data : null,
      message: action.message,
      status: action.status,
    })),
    on(fromMenuActions.FETCH_MENU_FAILED, (state, action) => ({
      ...state,
      error: action.error,
      data: null,
      loading: false,
      message: null,
      status: 0,
    }))
  );