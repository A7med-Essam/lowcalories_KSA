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
    extra_fifty_carb: number;
    extra_fifty_protein:number;
}
