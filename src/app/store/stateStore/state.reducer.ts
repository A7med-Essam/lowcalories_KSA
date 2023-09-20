import { createReducer, on } from '@ngrx/store';
import { IStateResponse } from 'src/app/interfaces/state.interface';
import { IHttpResponse } from '../appStore';
import * as fromStateActions from './state.action';

export interface IState extends IHttpResponse {
  data: IStateResponse[] | null;
}

const stateInitialState: IState = {
  error: null,
  loading: null,
  data: null,
  message: null,
  status: null,
};

export const StateReducer = createReducer(
  stateInitialState,
  on(fromStateActions.FETCH_STATE_START, (state) => ({
    ...state,
    loading: true,
    data: null,
    error: null,
    message: null,
    status: 0,
  })),
  on(fromStateActions.FETCH_STATE_SUCCESS, (state, action) => ({
    ...state,
    error: null,
    loading: false,
    data: action.status == 1 ? action.data : null,
    message: action.message,
    status: action.status,
  })),
  on(fromStateActions.FETCH_STATE_FAILED, (state, action) => ({
    ...state,
    error: action.error,
    data: null,
    loading: false,
    message: null,
    status: 0,
  }))
);
