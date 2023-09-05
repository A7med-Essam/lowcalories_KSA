export interface IMenuResponse {
    id:         number;
    name:       string;
    name_ar:    string;
    created_at: string;
    updated_at: string;
    menus:      IMenu[];
    icon:       string
}

export interface IMenu {
    id:             number;
    name:           string;
    name_ar:        string;
    category_id:    number;
    description_en: string;
    description_ar: string;
    nutrations:     string;
    price:          string;
    image:          string;
    created_at:     string;
    updated_at:     string;
}
