import { createReducer,on } from "@ngrx/store";
import { INormalPlanResponse, INormalProgramPriceResponse, IShowMealsResponse, ISubscriptionData } from "src/app/interfaces/normal-plan.interface";
import { IHttpResponse } from "../appStore";
import * as fromNormalPlanActions from "../normalPlanStore/normalPlan.action";


// ==============================================================GET PLAN===============================================================

export interface INormalPlanState extends IHttpResponse {
    data: INormalPlanResponse | null;
  }
  
  const normalPlanInitialState: INormalPlanState = {
    error: null,
    loading: null,
    data: null,
    message: null,
    status: null,
  };
  
  export const NormalPlanReducer = createReducer(
    normalPlanInitialState,
    on(fromNormalPlanActions.FETCH_NORMALPLAN_START, (state) => ({
      ...state,
      loading: true,
      data: null,
      error: null,
      message: null,
      status: 0,
    })),
    on(fromNormalPlanActions.FETCH_NORMALPLAN_SUCCESS, (state, action) => ({
      ...state,
      error: null,
      loading: false,
      data: action.status == 1 ? action.data : null,
      message: action.message,
      status: action.status,
    })),
    on(fromNormalPlanActions.FETCH_NORMALPLAN_FAILED, (state, action) => ({
      ...state,
      error: action.error,
      data: null,
      loading: false,
      message: null,
      status: 0,
    }))
  );

// ==============================================================SAVE SUBSCRIPTION===============================================================

    export interface INormalSubscriptionState {
      data: ISubscriptionData | null;
    }
    
    const NormalSubscriptionInitialState: INormalSubscriptionState = {
      data: null,
    };
    
    export const NormalSubscriptionReducer = createReducer(
      NormalSubscriptionInitialState,
      on(fromNormalPlanActions.SAVE_NORMAL_SUBSCRIPTION, (state, action) => ({
        ...state,
        data: action.data
      }))
    );

    // ==============================================================SAVE MEALS===============================================================

    export interface INormalSubscriptionMealsState {
      data: IShowMealsResponse[] | null;
    }
    
    const NormalSubscriptionMealsInitialState: INormalSubscriptionMealsState = {
      data: null,
    };
    
    export const NormalSubscriptionMealsReducer = createReducer(
      NormalSubscriptionMealsInitialState,
      on(fromNormalPlanActions.SAVE_NORMAL_MEALS, (state, action) => ({
        ...state,
        data: action.data
      }))
    );

// ==========================================================SHOW MEALS===================================================================

  export interface IShowMealsState extends IHttpResponse {
    data: IShowMealsResponse[] | null;
  }
  
  const showMealsInitialState: IShowMealsState = {
    error: null,
    loading: null,
    data: null,
    message: null,
    status: null,
  };
  
  export const ShowMealsReducer = createReducer(
    showMealsInitialState,
    on(fromNormalPlanActions.FETCH_SHOWMEALS_START, (state) => ({
      ...state,
      loading: true,
      data: null,
      error: null,
      message: null,
      status: 0,
    })),
    on(fromNormalPlanActions.FETCH_SHOWMEALS_SUCCESS, (state, action) => ({
      ...state,
      error: null,
      loading: false,
      data: action.status == 1 ? action.data : null,
      message: action.message,
      status: action.status,
    })),
    on(fromNormalPlanActions.FETCH_SHOWMEALS_FAILED, (state, action) => ({
      ...state,
      error: action.error,
      data: null,
      loading: false,
      message: null,
      status: 0,
    }))
  );
  
// ==========================================================PRICE===================================================================

export interface INormalPlanPriceState extends IHttpResponse {
  data: INormalProgramPriceResponse | null;
}

const normalPlanPriceInitialState: INormalPlanPriceState = {
  error: null,
  loading: null,
  data: null,
  message: null,
  status: null,
};

export const NormalPlanPriceReducer = createReducer(
  normalPlanPriceInitialState,
  on(fromNormalPlanActions.FETCH_NORMALPLAN_PRICE_START, (state) => ({
    ...state,
    loading: true,
    data: null,
    error: null,
    message: null,
    status: 0,
  })),
  on(fromNormalPlanActions.FETCH_NORMALPLAN_PRICE_SUCCESS, (state, action) => ({
    ...state,
    error: null,
    loading: false,
    data: action.status == 1 ? action.data : null,
    message: action.message,
    status: action.status,
  })),
  on(fromNormalPlanActions.FETCH_NORMALPLAN_PRICE_FAILED, (state, action) => ({
    ...state,
    error: action.error,
    data: null,
    loading: false,
    message: null,
    status: 0,
  }))
);

// ==============================================================Checkout===============================================================

export interface ICheckoutState extends IHttpResponse {
  data: string | null;
}

const NormalCheckoutInitialState: ICheckoutState = {
  error: null,
  loading: null,
  data: null,
  message: null,
  status: null,
};

export const NormalPlanCheckoutReducer = createReducer(
  NormalCheckoutInitialState,
  on(fromNormalPlanActions.FETCH_CHECKOUT_START, (state) => ({
    ...state,
    loading: true,
    data: null,
    error: null,
    message: null,
    status: 0,
  })),
  on(fromNormalPlanActions.FETCH_CHECKOUT_SUCCESS, (state, action) => ({
    ...state,
    error: null,
    loading: false,
    data: action.data,
    message: action.message,
    status: action.status,
  })),
  on(fromNormalPlanActions.FETCH_CHECKOUT_FAILED, (state, action) => ({
    ...state,
    error: action.error,
    data: null,
    loading: false,
    message: null,
    status: 0,
  }))
);