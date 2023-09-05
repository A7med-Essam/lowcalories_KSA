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
}
