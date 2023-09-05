export interface IAddressResponse {
    id:              number;
    emirate_id:      number;
    area_id:         string;
    property_number: string;
    landmark:        string;
    emirate:         Emirate;
}

export interface Emirate {
    id:           number;
    en_name:      string;
    ar_name:      string;
    inbody_price: number;
}