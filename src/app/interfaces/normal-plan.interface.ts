export interface INormalPlanResponse {
    id:          number;
    program_id:  number;
    name:        string;
    name_ar:     string;
    no_meals:    number;
    plan_prices: string;
    details:     null;
    options:     IOptions[];
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
    shortcut_name:  string;
    image_new:      string;
    bag_price:      number;
    snack_price:    number;
}

export interface IOptions {
    id:            number;
    plan_id:       number;
    no_days:       string;
    shortcut_name: string;
    price:         string;
}

export interface IShowMealsResponse {
    day:   string;
    date:  Date;
    meals: INormalPlanMeal[];
}

interface INormalPlanMeal {
    id:               number;
    program_id:       number;
    plan_id:          number;
    category_meal_id: number;
    level:            string;
    name:             string;
    name_ar:          string;
    description:      string;
    description_ar:   string;
    type:             string
    meal_unit:        string;
    side_unit:        string;
    max_meal:         number;
    max_side:         number;
    image:            string;
    image_web:        string;
}

export interface ISubscriptionData {
    plan_option_id: number;
    start_date:     string;
    delivery_days:  string[];
    meal_types:     string[];
    program_id:     number;
    no_snacks:      number;
    no_days:        number
}

export interface INormalProgramPriceResponse{
    code_id:     number;
    price:       number;
    code_apply:  number;
    vat:         number;
    grand_total: number;
}


export interface INormalSubscriptionPrice{
    program_id:     number;
    meal_count:     number;
    day_count:      number;
    snack_count:    number;
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
    meal_types:     string[];
    program_id:     number;
    no_snacks:      number;
    grand_total:    number;
    price:          number;
    code_id:        number;
    bag:            number;
    cutlery:        number;
    location: {
        emirate_id:     number;
        area_id:        string;
        property_number:any;
        landmark:       string
    }
    first_name? :    string;
    last_name?:      string;
    email?:          string;
    phone_number?:   string;
    password?:       string;
}

