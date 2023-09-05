import { createReducer,on } from "@ngrx/store";
import { ICards, ICategoriesResponse, ICustomMealsResponse, ICustomPlanResponse, ICustomProgramPriceResponse, ISubscriptionData } from "src/app/interfaces/custom-plan.interface";
import { IHttpResponse } from "../appStore";
import * as fromCustomPlanActions from "../customPlanStore/customPlan.action";

export interface ICustomPlanState extends IHttpResponse {
    data: ICustomPlanResponse[] | null;
  }
  
  const customPlanInitialState: ICustomPlanState = {
    error: null,
    loading: null,
    data: null,
    message: null,
    status: null,
  };
  
  export const CustomPlanReducer = createReducer(
    customPlanInitialState,
    on(fromCustomPlanActions.FETCH_CUSTOMPLAN_START, (state) => ({
      ...state,
      loading: true,
      data: null,
      error: null,
      message: null,
      status: 0,
    })),
    on(fromCustomPlanActions.FETCH_CUSTOMPLAN_SUCCESS, (state, action) => ({
      ...state,
      error: null,
      loading: false,
      data: action.status == 1 ? action.data : null,
      message: action.message,
      status: action.status,
    })),
    on(fromCustomPlanActions.FETCH_CUSTOMPLAN_FAILED, (state, action) => ({
      ...state,
      error: action.error,
      data: null,
      loading: false,
      message: null,
      status: 0,
    }))
  );

  // ============================================================SAVE Subscription step1=================================================================

  export interface ICustomSubscriptionState {
    data: ISubscriptionData | null;
  }
  
  const CustomSubscriptionInitialState: ICustomSubscriptionState = {
    data: null,
  };
  
  export const CustomSubscriptionReducer = createReducer(
    CustomSubscriptionInitialState,
    on(fromCustomPlanActions.SAVE_CUSTOM_SUBSCRIPTION, (state, action) => ({
      ...state,
      data: action.data
    }))
  );


  // ============================================================SHOW MEALS STEP2=================================================================

  export interface ICustomShowMealsState extends IHttpResponse {
    data: ICustomMealsResponse[] | null;
  }
  
  const showMealsInitialState: ICustomShowMealsState = {
    error: null,
    loading: null,
    data: null,
    message: null,
    status: null,
  };
  
  export const ShowMealsReducer = createReducer(
    showMealsInitialState,
    on(fromCustomPlanActions.FETCH_CUSTOMPLAN_SHOWMEALS_START, (state) => ({
      ...state,
      loading: true,
      data: null,
      error: null,
      message: null,
      status: 0,
    })),
    on(fromCustomPlanActions.FETCH_CUSTOMPLAN_SHOWMEALS_SUCCESS, (state, action) => ({
      ...state,
      error: null,
      loading: false,
      data: action.status == 1 ? action.data : null,
      message: action.message,
      status: action.status,
    })),
    on(fromCustomPlanActions.FETCH_CUSTOMPLAN_SHOWMEALS_FAILED, (state, action) => ({
      ...state,
      error: action.error,
      data: null,
      loading: false,
      message: null,
      status: 0,
    }))
  );

    // =======================================================CATEGORY======================================================================

    export interface ICustomShowCategoriesState extends IHttpResponse {
      data: ICategoriesResponse[] | null;
    }
    
    const showCategoriesInitialState: ICustomShowCategoriesState = {
      error: null,
      loading: null,
      data: null,
      message: null,
      status: null,
    };
    
    export const ShowCategoriesReducer = createReducer(
      showCategoriesInitialState,
      on(fromCustomPlanActions.FETCH_CUSTOMPLAN_SHOWCATEGORIES_START, (state) => ({
        ...state,
        loading: true,
        data: null,
        error: null,
        message: null,
        status: 0,
      })),
      on(fromCustomPlanActions.FETCH_CUSTOMPLAN_SHOWCATEGORIES_SUCCESS, (state, action) => ({
        ...state,
        error: null,
        loading: false,
        data: action.status == 1 ? action.data : null,
        message: action.message,
        status: action.status,
      })),
      on(fromCustomPlanActions.FETCH_CUSTOMPLAN_SHOWCATEGORIES_FAILED, (state, action) => ({
        ...state,
        error: action.error,
        data: null,
        loading: false,
        message: null,
        status: 0,
      }))
    );

      // ============================================================SAVE CARDS=================================================================

  export interface ICustomCardsState {
    data: ICards[] | null;
  }
  
  const CustomCardsInitialState: ICustomCardsState = {
    data: null,
  };
  
  export const CustomCardsReducer = createReducer(
    CustomCardsInitialState,
    on(fromCustomPlanActions.SAVE_CUSTOMPLAN_CARDS, (state, action) => ({
      ...state,
      data: action.data
    }))
  );
    
// ==========================================================PRICE===================================================================

export interface ICustomPlanPriceState extends IHttpResponse {
  data: ICustomProgramPriceResponse | null;
}

const customPlanPriceInitialState: ICustomPlanPriceState = {
  error: null,
  loading: null,
  data: null,
  message: null,
  status: null,
};

export const CustomPlanPriceReducer = createReducer(
  customPlanPriceInitialState,
  on(fromCustomPlanActions.FETCH_CUSTOMPLAN_PRICE_START, (state) => ({
    ...state,
    loading: true,
    data: null,
    error: null,
    message: null,
    status: 0,
  })),
  on(fromCustomPlanActions.FETCH_CUSTOMPLAN_PRICE_SUCCESS, (state, action) => ({
    ...state,
    error: null,
    loading: false,
    data: action.status == 1 ? action.data : null,
    message: action.message,
    status: action.status,
  })),
  on(fromCustomPlanActions.FETCH_CUSTOMPLAN_PRICE_FAILED, (state, action) => ({
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

const CustomCheckoutInitialState: ICheckoutState = {
  error: null,
  loading: null,
  data: null,
  message: null,
  status: null,
};

export const CustomPlanCheckoutReducer = createReducer(
  CustomCheckoutInitialState,
  on(fromCustomPlanActions.FETCH_CHECKOUT_START, (state) => ({
    ...state,
    loading: true,
    data: null,
    error: null,
    message: null,
    status: 0,
  })),
  on(fromCustomPlanActions.FETCH_CHECKOUT_SUCCESS, (state, action) => ({
    ...state,
    error: null,
    loading: false,
    data: action.data,
    message: action.message,
    status: action.status,
  })),
  on(fromCustomPlanActions.FETCH_CHECKOUT_FAILED, (state, action) => ({
    ...state,
    error: action.error,
    data: null,
    loading: false,
    message: null,
    status: 0,
  }))
);