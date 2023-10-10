export interface IGiftCodeData{
    program_id:     number;
    price:          number;
    code:           string;
}

export interface IGiftCodeResponse{
    code_id:     number;
    price:       number;
    code_apply:  number;
    vat:         number;
    grand_total: number;
    bag_price :  number;
    extra_details:Extra;
    global_extra_carb:number
    global_extra_protein:number
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