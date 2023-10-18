import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from 'src/app/core/services/api.service';
import { ICheckout, INormalProgramPriceResponse, INormalSubscriptionPrice, IReplacement, IReplacementData } from 'src/app/interfaces/normal-plan.interface';
import { INormalPlanResponse, IShowMealsResponse, ISubscriptionData } from 'src/app/interfaces/normal-plan.interface';

@Injectable({
  providedIn: 'root'
})
export class NormalPlanService {
  constructor(
    private _ApiService:ApiService,
  ) { }

  getMeals(SubscriptionForm:ISubscriptionData): Observable<{ status: number; data: IShowMealsResponse[]; message: string }> {
    return this._ApiService.postReq('showMealInDetailV2',SubscriptionForm);
  }

  getNormalProgramDetails(program_id:number): Observable<{ status: number; data: INormalPlanResponse; message: string }> {
    return this._ApiService.postReq('program_details', {program_id});
  }

  getNormalProgramPrice(subscription:INormalSubscriptionPrice) : Observable<{status:number,data:INormalProgramPriceResponse, message:string}>{
    return this._ApiService.postReq('program_prices', subscription);
  }

  checkout(checkout:ICheckout): Observable<{status:number,data:string, message:string}>{
    if (checkout.mobile) {
      return this._ApiService.postReq('checkOutWithOutAuth', checkout);
    }
    else{
      return this._ApiService.postReq('checkOutWithAuth', checkout);
    }
  }

  replaceMeal(data:IReplacementData) : Observable<{status:number,data:IReplacement[], message:string}>{
    return this._ApiService.postReq('replacementMeals', data);
  }
}
