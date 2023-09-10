export interface ICustomPlanResponse {
    id:          number;
    program_id:  number;
    name:        string;
    name_ar:     string;
    no_meals:    number;
    plan_prices: PlanPrices;
    details:     Details;
    options:     any[];
    myprogram:   IMyProgram;
}

interface IMyProgram {
    id:             number;
    active:         number;
    type:           string;
    company:        string;
    name:           string;
    name_ar:        string;
    description:    string;
    description_ar: string;
    image:          string;
    order_number:   number;
    max_meals:      number;
    no_snacks:      number;
    shortcut_name:  null;
    image_new:      string;
    bag_price:      number;
    snack_price:    number;
}

interface Details {
    max_meal:  number;
    max_snack: number;
    max_days:  number;
    min_days:  number;
}

interface PlanPrices {
    one_meal:   number;
    two_meal:   number;
    three_meal: number;
    four_meal:  number;
    five_meal:  number;
    six_meal:   number;
}

export interface ISubscriptionData {
    number_of_Days:      string;
    number_of_Snacks:    number;
    number_of_Meals:     string[];
    Plan_Type:           ICustomPlanResponse;
    start_date:          string;
    delivery_days:       string[];
    program_id:          number;
}

// ========================================================================== MEALS ==========================================================================
export interface ICategoriesResponse {
    id:      number;
    level:   string;
    type:    string;
    name:    string;
    name_ar: string;
}

export interface ICustomMealsResponse {
    id:             number;
    category_id:    number;
    image:          string;
    img:            string;
    description:    string;
    description_ar: string;
    type:           string;
    mainDish:       IDish;
    sideDish:       IDish;
}

export interface IDish {
    name:      string;
    name_ar:   string;
    max_meal: number;
    unit:      string;
    calories:  number;
    carb:      number;
    protein:   number;
    fat:       number;
    kilj:      number;
    max_side: number;
}

export interface ICards {
    date: string;
    day: string;
    meals: any[];
    snacks: any[];
}
// ========================================================================== checkout ==========================================================================

export interface ICustomSubscriptionPrice{
    plan_id:     number;
    meal_count:     number;
    day_count:      number;
    snack_count:    number;
}

export interface ICustomProgramPriceResponse{
    code_id:     number;
    price:       number;
    code_apply:  number;
    vat:         number;
    grand_total: number;
    bag_price :  number
}

export interface ICheckout {
    first_name?:         string;
    last_name?:          string;
    email?:              string;
    phone_number?:       string;
    password?:           string;
    bag:                number;
    cutlery:            number;
    plan_id:            number;
    total_price:        number;
    price:              number;
    meals_count:        number;
    snacks_count:       number;
    days_count:         number;
    delivery_days:      string[];
    start_delivery_day: string;
    meal_types:         string[];
    code_id:            number;
    location:           ICheckoutLocation;
    list_days:          ICheckoutListDay[];
}

 export interface ICheckoutListDay {
    day:   string;
    date:  string;
    meals: ICheckoutMeal[];
}

 export interface ICheckoutMeal {
    meal_id:   number;
    main_unit: string;
    side_unit: string;
    max_main:  number;
    max_side:  number;
    type:      string;
}

 interface ICheckoutLocation {
    emirate_id:      number;
    area_id:         string;
    property_number: string;
    landmark:        string;
}