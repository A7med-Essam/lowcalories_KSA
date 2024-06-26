import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { IReplacement } from '../interfaces/normal-plan.interface';
import { IRequestChangeMeal, IRequestChangeMealResponse, ProfileMeal, ProfileMealsResponse } from '../store/profileStore/profile.action';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private _ApiService:ApiService
  ) { }

      // ===================================================================PROFILE=====================================================

  getUserInfo(): Observable<any> {
    return this._ApiService.postReq('profile','');
  }

  updateProfile(profileInfo:any): Observable<any> {
    return this._ApiService.postReq('completeOrUpdateProfile', profileInfo);
  }

  updateProfileImage(image:File): Observable<any>{
    return this._ApiService.postReq('updateProfileImage', image);
  }
    // ===================================================================BOOT=====================================================

  getQuestions(): Observable<any> {
    return this._ApiService.getReq('bootQuestions');
  }

  getAnswers(question_id:number): Observable<any> {
    return this._ApiService.postReq('bootAnswers', question_id);
  }

    // ===================================================================PASSWORD=====================================================

  resetPassword_profile(
    password: any
  ): Observable<any> {
    return this._ApiService.postReq('resetPassword', password);
  }

  // ===================================================================MY ADDRESS=====================================================

  getEmirates(): Observable<any> {
    return this._ApiService.postReq('getStates', '');
  }

  getAreas(state_id: number): Observable<any> {
    return this._ApiService.postReq('areas', { state_id });
  }

  getAddresses(): Observable<any> {
    return this._ApiService.postReq('addresses', '');
  }

  deleteAddress(address_id: number): Observable<any> {
    return this._ApiService.postReq('deleteAddresses', {
      address_id: address_id,
    });
  }

  createAddress(address_info: any): Observable<any> {
    return this._ApiService.postReq('createAddresses', address_info);
  }

  updateAddress(address_info: any): Observable<any> {
    return this._ApiService.postReq('updateAddresses', address_info);
  }

  getGovernments(): Observable<any> {
    return this._ApiService.postReq('dashboard/governments', {
      withoutPagination: true,
    });
  }

  // ===================================================================MY PLANS=====================================================

  getMyPlans(phone: string): Observable<any> {
    const headers = new HttpHeaders().set('company', '1')
    return this._ApiService.getReq2(`Subscription/${phone}`, headers);
  }

  // ===================================================================Calender=====================================================
  currentPlan: BehaviorSubject<any> = new BehaviorSubject(null);

  // getPlanImages(meals: any): Observable<any> {
  //   return this._ApiService.postReq(`getImagesByMealNames`, meals);
  // }
  // ===================================================================CHANGE MEAL=====================================================

  // getReplacementMeals(data:{item:string,dish_type:string}) : Observable<{status:number,data:IReplacement[], message:string}>{
  //   return this._ApiService.postReq('replacementMealsWithoutIds', data);
  // }

  // ===================================================================CHANGE MEAL=====================================================

  getProfileMeals(data:ProfileMeal[]) : Observable<{status:number,data:ProfileMealsResponse[], message:string}>{
    return this._ApiService.postReq('getImagesByMealNames', data);
  }

  changeMeal(data:IRequestChangeMeal) : Observable<{status:number,data:IRequestChangeMealResponse, message:string}>{
    return this._ApiService.postReq('requestChangeMeal', data);
  }

}
