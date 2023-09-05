import { createReducer, on } from '@ngrx/store';
import {
  IRegisterResponse,
  ILoginResponse,
} from 'src/app/interfaces/auth.interface';
import { IHttpResponse } from '../appStore';
import * as fromAuthActions from './auth.action';

// ================================================================ LOGIN ================================================================
export interface ILoginState extends IHttpResponse {
  data: ILoginResponse | null;
}

const loginInitial: ILoginState = {
  error: null,
  loading: null,
  data: null,
  message: null,
  status: null,
};

export const LoginReducer = createReducer(
  loginInitial,
  on(fromAuthActions.LOGIN_START, (state) => ({
    ...state,
    loading: true,
    data: null,
    error: null,
  })),
  on(fromAuthActions.LOGIN_SUCCESS, (state, action) => ({
    ...state,
    error: null,
    loading: false,
    data: action.status == 1 ? action.data : null,
    message: action.message,
    status: action.status,
  })),
  on(fromAuthActions.LOGIN_FAILED, (state, action) => ({
    ...state,
    error: action.error,
    data: null,
    loading: false,
    message: null,
    status: 0,
  })),
  on(fromAuthActions.LOGOUT_START, (state) => ({
    ...state,
    loading: true,
    // data:null
  })),
  on(fromAuthActions.LOGOUT_SUCCESS, (state, action) => ({
    ...state,
    data: null,
    loading:false,
    message:null
  }))
);

// ================================================================ Register ================================================================

export interface IRegisterState extends IHttpResponse {
  data: IRegisterResponse | null;
}

const registerInitial: IRegisterState = {
  error: null,
  loading: null,
  data: null,
  message: null,
  status: null,
};

export const RegisterReducer = createReducer(
  registerInitial,
  on(fromAuthActions.REGISTER_START, (state) => ({
    ...state,
    loading: true,
    data: null,
    error: null,
    message: null,
    status: 0,
  })),
  on(fromAuthActions.REGISTER_SUCCESS, (state, action) => ({
    ...state,
    error: null,
    loading: false,
    data: action.status == 1 ? action.data : null,
    message: action.message,
    status: action.status,
  })),
  on(fromAuthActions.REGISTER_FAILED, (state, action) => ({
    ...state,
    error: action.error,
    data: null,
    loading: false,
    message: null,
    status: 0,
  }))
);
