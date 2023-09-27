export interface IStateResponse {
  id: number;
  name: string;
  name_ar: string;
  areas: Area[];
}

export interface Area {
  id: number;
  area_ar: string;
  area_en: string;
  deleted_at: null;
  fees: Fees[];
}

export interface Fees {
  area_id: number;
  days: number;
  deleted_at: any;
  fees: number;
  id: number;
}
