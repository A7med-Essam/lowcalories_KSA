export interface INormalPlanResponse {
    id:                number;
    name:              string;
    name_ar:           string;
    description_ar:           string;
    description:           string;
    min_meals:         number;
    image:             string;
    meal_types:        MealType[];
    snack_types:       MealType[];
    subscription_days: SubscriptionDay[];
    delivery_days:     DeliveryDay[];
    shortcut_name:     string;
    extra_prices:       {
        carb:number
        protein:number
    }
}

export interface DeliveryDay {
    id:               number;
    day_name:         string;
    day_name_ar:      string;
    closed:           number;
    deleted_at:       null;
    day_name_in_view: string;
}

export interface MealType {
    id:                number;
    meal_type_name:    string;
    meal_type_name_ar: string;
    meal_name_backend: string;
    meal_type:         string;
    order_number:      number;
    program_id:        number;
    deleted_at:        null;
}

export interface SubscriptionDay {
    id:         number;
    day_count:  string;
    program_id: number;
    deleted_at: any;
    displayName: string;
    displayName_ar: string;
}

export interface IShowMealsResponse {
    day:   string;
    date:  Date;
    meals: Meal[];
}

export interface Meal {
    mainDish: Dish;
    sideDish: Dish[];
    meal_name : string
    meal_name_ar : string
    meal_image : string
}

export interface Dish {
    meal_id:         number;
    meal_type:       string;
    meal_name_en:    string;
    meal_name:       string;
    meal_name_ar:    string;
    unit:            string;
    meal_name_image: string;
    protein:         number;
    calories:        number;
    carb:            number;
    fat:             number;
    qty:             number;
    defaultQty:      number;
    min_qty:         number;
    tag:             string|null;
    counter:         number;
    extra:           extra
    is_replaced:      boolean
    has_replaced:      boolean;
    old_name:           string;
}

interface extra {
    carb:number;
    protein:number;
}

export interface ISubscriptionData {
    program_id:       number;
    subscription_days:number;
    meal_types:       string[];
    delivery_days:    string[];
    start_date:       string;
    snacks:           string[];
    meals:            string[];
}

export interface INormalProgramPriceResponse{
    code_id:     number;
    price:       number;
    code_apply:  number;
    vat:         number;
    grand_total: number;
    bag_price :  number;
    global_extra_carb:number
    global_extra_protein:number
    extra_details:Extra;
}

export interface Extra {
    carb:    extraPrice;
    protein: extraPrice;
}

export interface extraPrice {
    PCS:         number;
    GM:          number;
    total_price: number;
}

export interface INormalSubscriptionPrice{
    program_id:     number;
    meal_count:     number;
    subscription_day_count:      number;
    snack_count:    number;
    list_days?:  IShowMealsResponse[];
    global_extra_carb? :number
    global_extra_protein? :number
    include_breakfast:boolean
}

export interface IGiftCodeData{
    program_id:     number;
    price:          number;
    code:           string;
}

export interface ICheckout {
    plan_option_id: number;
    start_date:     string;
    delivery_days:  string[];
    meal_backend_types:     string[];
    snack_backend_types:     string[];
    program_id:     number;
    no_snacks:      number;
    total_price:    number;
    price:          number;
    code_id:        number;
    dislike_meals:  [];
    delivery_status: boolean
    subscription_days: number;
    state_id:     number;
    area_id:        string;
    name? :    string;
    email?:          string;
    mobile?:   string;
    password?:       string;
    subscription_from :string,
    address_id: number,
    address?: string,
    list_days:  IShowMealsResponse[];
    global_extra_carb:number
    global_extra_protein:number
    include_breakfast:boolean
}

export interface IReplacement {
    mainDish: Dish;
    sideDish: Dish[];
    meal_name : string
    meal_name_ar : string
    meal_image : string
}

export interface IReplacementData {
    program_id:      number;
    item:            string;
    dish_type:       string;
    date:            Date;
    meal_type:       string;
}