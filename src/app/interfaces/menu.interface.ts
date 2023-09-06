export interface IMenuResponse {
    category_id:      number;
    category_name:    string;
    category_name_ar: string;
    icon:             string;
    meals:            Meal[];
}

export interface Meal {
    id:             number;
    meal_name_en:   string;
    meal_name_ar:   string;
    description:    string;
    description_ar: string;
    meal_image:     string;
    meal_calories:  number;
    meal_carb:      number;
    meal_protein:   number;
    meal_fat:       number;
    meal_unit:      MealUnit;
    meal_price:     number;
}

export enum MealUnit {
    Gm = "GM",
    Pcs = "PCS",
}

// export interface IMenuResponse {
//     id:         number;
//     name:       string;
//     name_ar:    string;
//     created_at: string;
//     updated_at: string;
//     menus:      IMenu[];
//     icon:       string
// }

// export interface IMenu {
//     id:             number;
//     name:           string;
//     name_ar:        string;
//     category_id:    number;
//     description_en: string;
//     description_ar: string;
//     nutrations:     string;
//     price:          string;
//     image:          string;
//     created_at:     string;
//     updated_at:     string;
// }
