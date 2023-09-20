export interface IStateResponse {
    id:      number;
    name:    string;
    name_ar: string;
    areas:   Area[];
}

export interface Area {
    id:         number;
    area_ar:    string;
    area_en:    string;
    deleted_at: null;
    fees:       any[];
}
