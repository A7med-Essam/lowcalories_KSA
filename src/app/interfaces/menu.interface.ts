// export interface IMenuResponse {
//     category_id:      number;
//     category_name:    string;
//     category_name_ar: string;
//     icon:             string;
//     meals:            Meal[];
// }

export interface IMenuResponse {
    item:                string;
    item_ar:             string;
    image:               string;
    price:               number;
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

