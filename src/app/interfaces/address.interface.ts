// export interface IAddressResponse {
//     id:              number;
//     emirate_id:      number;
//     area_id:         string;
//     property_number: string;
//     landmark:        string;
//     emirate:         Emirate;
// }

export interface Emirate {
    id:           number;
    en_name:      string;
    ar_name:      string;
    inbody_price: number;
}
// ================================================


export interface IAddressResponse {
    id:         number;
    address:    string;
    landmark:   string;
    deleted_at: string;
    area:       Area;
}

export interface Area {
    id:         number;
    area_ar:    null;
    area_en:    string;
    deleted_at: null;
    state:      State;
}

export interface State {
    id:            number;
    name:          string;
    name_ar:       null;
    government_id: number;
    type:          string;
    inbody_price:  number;
    government:    Government;
}

export interface Government {
    id:      number;
    name:    string;
    name_ar: null;
}
