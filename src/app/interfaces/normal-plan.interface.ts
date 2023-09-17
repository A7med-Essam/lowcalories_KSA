// export interface INormalPlanResponse {
//     id:          number;
//     program_id:  number;
//     name:        string;
//     name_ar:     string;
//     no_meals:    number;
//     plan_prices: string;
//     details:     null;
//     options:     IOptions[];
//     myprogram:   IMyProgram;
// }

export interface INormalPlanResponse {
    id:                number;
    name:              string;
    name_ar:           string;
    min_meals:         number;
    image:             string;
    meal_types:        MealType[];
    snack_types:       MealType[];
    subscription_days: SubscriptionDay[];
    delivery_days:     DeliveryDay[];
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
    deleted_at: null;
}




// interface IMyProgram {
//     id:             number;
//     active:         number;
//     type:           string;
//     company:        string;
//     name:           string;
//     name_ar:        string;
//     description:    string;
//     description_ar: string;
//     image:          string;
//     order_number:   number;
//     max_meals:      number;
//     no_snacks:      number;
//     shortcut_name:  string;
//     image_new:      string;
//     bag_price:      number;
//     snack_price:    number;
// }

// export interface IOptions {
//     id:            number;
//     plan_id:       number;
//     no_days:       string;
//     shortcut_name: string;
//     price:         string;
// }

// export interface IShowMealsResponse {
//     day:   string;
//     date:  Date;
//     meals: INormalPlanMeal[];
// }

export interface IShowMealsResponse {
    day:   string;
    date:  Date;
    meals: Meal[];
}

export interface Meal {
    mainDish: Dish;
    sideDish: Dish[];
}

export interface Dish {
    meal_id:         number;
    meal_type:       string;
    meal_name_en:    string;
    meal_name_ar:    string;
    unit:            string;
    meal_name_image: string;
    protein:         number;
    calories:        number;
    carb:            number;
    fat:             number;
    qty:             number;
    defaultQty:      number;
}


// interface INormalPlanMeal {
//     id:               number;
//     program_id:       number;
//     plan_id:          number;
//     category_meal_id: number;
//     level:            string;
//     name:             string;
//     name_ar:          string;
//     description:      string;
//     description_ar:   string;
//     type:             string
//     meal_unit:        string;
//     side_unit:        string;
//     max_meal:         number;
//     max_side:         number;
//     image:            string;
//     image_web:        string;
// }

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
    bag_price :  number
}

export interface INormalSubscriptionPrice{
    program_id:     number;
    meal_count:     number;
    subscription_day_count:      number;
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
    meal_backend_types:     string[];
    program_id:     number;
    no_snacks:      number;
    total_price:    number;
    price:          number;
    code_id:        number;
    bag:            number;
    cutlery:        number;
    subscription_days: number;
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
    subscription_from :string,
    address_id: number
}

