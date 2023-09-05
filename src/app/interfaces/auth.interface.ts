// LOGIN
export interface ILoginResponse {
  id: number;
  role: string;
  first_name: string;
  last_name: string;
  type: string;
  gender: string;
  birthday: Date;
  email: string;
  height: string;
  Weight: string;
  phone_number: string;
  second_phone_number: string;
  land_line: string;
  email_verified_at: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
  emirate_id: number;
  area: string;
  address: string;
  floor: string;
  flat_number: string;
  access_token: string;
  image: null;
  cids: any[];
}

export interface ISignInData {
  email: string;
  password: string;
}

// REGISTER

export interface IRegisterResponse {
  phone_number: string;
  email:        string;
  first_name:   string;
  last_name:    string;
  gender:       string;
  birthday:     Date;
  height:       string;
  Weight:       string;
  updated_at:   Date;
  created_at:   Date;
  id:           number;
  auth_token:   string;
}

export interface ISignUpData {
  email: string;
  password: string;
  first_name:string
  last_name:string
  phone_number:number
  gender:string
  height:number
  Weight:number
  birthday:string
}