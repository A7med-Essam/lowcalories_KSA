// LOGIN
export interface ILoginResponse {
  id:             number;
  name:           string;
  status:         string;
  email:          string;
  country:        string;
  access_token:   string;
  mobile:         string;
  image:          string;
  password:       string;
  has_profile:    string;
  my_permissions: any[];
  my_role:        string;
  profile:        any;
  addresses:      any[];
  permissions:    any[];
  system_id :     number;
}

export interface ISignInData {
  email: string;
  password: string;
}

// REGISTER

export interface IRegisterResponse {
  id:             number;
  name:           string;
  status:         string;
  email:          string;
  country:        string;
  access_token:   string;
  mobile:         string;
  image:          string;
  password:       string;
  has_profile:    string;
  my_permissions: any[];
  my_role:        string;
  profile:        any;
  addresses:      any[];
  permissions:    any[];
  system_id :     number;
}

export interface ISignUpData {
  email: string;
  password: string;
  name: string;
  mobile:number
}