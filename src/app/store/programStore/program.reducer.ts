import { createReducer,on } from "@ngrx/store";
import { IProgramResponse } from "src/app/interfaces/program.interface";
import { IHttpResponse } from "../appStore";
import * as fromProgramActions from "../programStore/program.action";

export interface IProgramState extends IHttpResponse {
    data: IProgramResponse[] | null;
  }
  
  const programInitialState: IProgramState = {
    error: null,
    loading: null,
    data: null,
    message: null,
    status: null,
  };
  
  export const ProgramReducer = createReducer(
    programInitialState,
    on(fromProgramActions.FETCH_PROGRAM_START, (state) => ({
      ...state,
      loading: true,
      data: null,
      error: null,
      message: null,
      status: 0,
    })),
    on(fromProgramActions.FETCH_PROGRAM_SUCCESS, (state, action) => ({
      ...state,
      error: null,
      loading: false,
      data: action.status == 1 ? action.data : null,
      message: action.message,
      status: action.status,
    })),
    on(fromProgramActions.FETCH_PROGRAM_FAILED, (state, action) => ({
      ...state,
      error: action.error,
      data: null,
      loading: false,
      message: null,
      status: 0,
    }))
  );