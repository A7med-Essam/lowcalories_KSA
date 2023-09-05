import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';

import { Observable, takeUntil, Subject } from 'rxjs';
import {
  IAppointment,
  IClinicCheckout,
  IClinicStep1Form,
  IEmirateAppointmentsResponse,
  ITime,
} from 'src/app/interfaces/clinic.interface';
import { SharedService } from 'src/app/services/shared.service';
import {
  clinicCheckoutSelector,
  clinicEmirateSelector,
} from 'src/app/store/clinicStore/clinic.selector';
import { FETCH_CLINIC_CHECKOUT_START } from 'src/app/store/clinicStore/clinic.action';
import Swal from 'sweetalert2';
import { AnimationOptions } from 'ngx-lottie';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit, OnDestroy {
  private destroyed$: Subject<void> = new Subject();
  emirates$!: Observable<IEmirateAppointmentsResponse[] | null>;
  @Input() Step1Form!: IClinicStep1Form;
  selectedEmirate!: IEmirateAppointmentsResponse;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  disabledDates: Date[] = [];
  times: ITime[] = [];
  max_people: number = 1;
  inbodyPrice: number = 0;
  selectedAppointment!: IAppointment;
  mobile: string = '971505025430';
  selectedTime: number = 0;
  selectedMembers: number = 1;
  @ViewChild('lottie') lottie!: ElementRef;
  paymentSwal: any;
  options: AnimationOptions = {
    path: '../../../../../../assets/lottie/payment.json'
  };
  checkoutResponse$!: Observable<any>;
  @Output() goBack = new EventEmitter<any>();

  constructor(
    private _SharedService: SharedService,
    private _Store: Store,
    private _Location: Location,
    private translate:TranslateService
  ) {}

  ngOnInit(): void {
    this._Store
      .select(clinicEmirateSelector)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        res || this._Location.back();
        const filtered = res?.filter(
          (r) => r.id == this.Step1Form.emirate_id
        )[0];
        filtered != undefined && (this.selectedEmirate = filtered);
        this.minDate = this.getMinDate(this.selectedEmirate.appointments);
        this.maxDate = this.getMaxDate(this.selectedEmirate.appointments);
        this.disabledDates = this.getDatesBetween(this.minDate, this.maxDate);
      });
  }

  getMinDate(appointments: IAppointment[]): Date {
    const currentDate = new Date();
    const nextAppointment = appointments.find(
      (appointment) => new Date(appointment.date) > currentDate
    );
    if (nextAppointment) {
      return new Date(nextAppointment.date);
    } else {
      return new Date('9000-09-09');
    }
  }

  getMaxDate(appointments: IAppointment[]): Date {
    const dates: string[] = appointments.map((appointment) => appointment.date);
    return dates.reduce((max, date) => {
      const currentDate = new Date(date);
      return currentDate > max ? currentDate : max;
    }, new Date(0));
  }

  getDatesBetween(startDate: Date, endDate: Date) {
    let datesBetween = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      datesBetween.push(
        currentDate.toLocaleDateString('pt-br').split('/').reverse().join('-')
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }
    datesBetween = this.removeDuplicateDates(
      datesBetween,
      this.selectedEmirate.appointments
    );
    datesBetween = this.convertStringsToDates(datesBetween);
    return datesBetween;
  }

  removeDuplicateDates(arrayA: string[], arrayB: IAppointment[]) {
    const datesB = arrayB.map((item) => item.date);
    return arrayA.filter((item) => !datesB.includes(item));
  }

  convertStringsToDates(stringDates: string[]): Date[] {
    return stringDates.map((dateString) => new Date(dateString));
  }

  getSelectedDate(e: any) {
    const selectedDate = new Date(e)
      .toLocaleDateString('pt-br')
      .split('/')
      .reverse()
      .join('-');
    [this.selectedAppointment] = this.selectedEmirate.appointments.filter(
      (app) => app.date == selectedDate
    );
    this.times = this.selectedAppointment.times;
    this.max_people = this.selectedAppointment.max_people;
    this.inbodyPrice = Number(this.selectedEmirate.inbody_price);
    this.selectedTime = 0;
  }

  countUp(e: HTMLInputElement) {
    if (e.value < e.max) {
      let int = parseInt(e.value) + 1;
      e.value = int.toString();
    }
    this.getInbodyPrice(Number(e.value));
  }

  countDown(e: HTMLInputElement) {
    let int = parseInt(e.value) - 1;
    e.value = int.toString();
    if (parseInt(e.value) <= parseInt(e.min)) {
      e.value = e.min;
    }
    this.getInbodyPrice(Number(e.value));
  }

  getInbodyPrice(clients: number) {
    this.selectedMembers = clients;
    this.inbodyPrice = Number(this.selectedEmirate.inbody_price) * clients;
  }

  toggleAppointments(e: Event) {
    let el = e.target as Element;
    el.classList.add('active');
    const Siblings = this._SharedService.getAllSiblings(
      el.parentElement,
      el.parentElement?.parentElement
    );
    Siblings.forEach((e: HTMLElement) => {
      e.children[0].classList.remove('active');
    });
  }

  getSelectedTime(time_id: number) {
    this.selectedTime = time_id;
  }

  getCheckout() {
    const data: IClinicCheckout = {
      address: this.Step1Form.address,
      email: this.Step1Form.email,
      first_name: this.Step1Form.first_name,
      phone_number: this.Step1Form.phone_number,
      whatsApp: this.Step1Form.whatsApp,
      emirate_id: this.Step1Form.emirate_id,
      max_people: this.selectedMembers,
      date: this.selectedAppointment.date,
      day: this.selectedAppointment.day,
      time_id: this.selectedTime,
    };
    this._Store.dispatch(FETCH_CLINIC_CHECKOUT_START({ data }));
    this.fireSwal();
    this.redirectToPaymentGateway();
  }

  redirectToPaymentGateway() {
    this.checkoutResponse$ = this._Store.select(clinicCheckoutSelector);
    this.checkoutResponse$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      res.loading == false && this.paymentSwal.close();
      if (res.data) {
        res.status == 1 && (window.location.href = res.data);
      }else{
        if (res.message !== null && res.status == 0) {
          Swal.fire({
            icon: 'error',
            title: this.translate.currentLang == 'ar'? "أُووبس...":'Oops...',
            text: res.message,
            confirmButtonText: this.translate.currentLang == 'ar'? "تأكيد":'Confirm',
          })
        }
      }
    });
  }

  fireSwal() {
    this.paymentSwal = Swal.mixin({
      showConfirmButton: false,
      timerProgressBar: false,
    });

    this.paymentSwal.fire({
      html: this.lottie.nativeElement,
    });
  }

  getBack(){
    this.goBack.emit();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
