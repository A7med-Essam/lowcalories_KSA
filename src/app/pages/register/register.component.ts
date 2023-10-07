import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { IRegisterState } from 'src/app/store/authStore/auth.reducer';
import { registerSelector } from 'src/app/store/authStore/auth.selector';
import { REGISTER_START } from '../../store/authStore/auth.action';
import { ConfirmedValidator } from './ConfirmedValidator';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Calendar } from 'primeng/calendar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit,OnDestroy {
  gender: string[] = ['male', 'female'];
  registerForm: FormGroup = new FormGroup({});
  register$!: Observable<IRegisterState>;
  subscribe$!: Subscription;
  maxBirthdate:Date;
  minBirthdate: Date;
  constructor(private _FormBuilder: FormBuilder, private _Store: Store, private translate:TranslateService) {
    this.maxBirthdate = new Date("2015-12-31")
    this.minBirthdate = new Date('1940-01-01')
    this.register$ = _Store.select(registerSelector);

    this.subscribe$ = _Store.select(registerSelector)
    .subscribe(res=>{
      if (res.message !== null && res.status == 0) {
        Swal.fire({
          icon: 'error',
          title: this.translate.currentLang == 'ar'?"أُووبس...":'Oops...',
          text: res.message,
          confirmButtonText: this.translate.currentLang == 'ar'? "حسنا":'OK',
        })
      }
    });
  }

  ngOnDestroy(): void {
    this.subscribe$.unsubscribe();
  }

  ngOnInit(): void {
    this.setRegisterForm();
  }

  setRegisterForm() {
    this.registerForm = this._FormBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      birthday: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required, Validators.max(20), Validators.min(1)]),
      mobile: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      confirm_password: new FormControl(null),
    },{ 
      validator: ConfirmedValidator('password', 'confirm_password')
    } as AbstractControlOptions);
  }

  onSubmit(data: FormGroup) {
    if (data.valid) {
      data.get("birthday")?.patchValue(new Date(this.registerForm.value.birthday).toLocaleDateString('en-CA'))
      this._Store.dispatch(REGISTER_START({ data: data.value }));
    }
  }


  @ViewChild('calendar') calendar!: Calendar;
  onDateChange(e: any) {
    if (this.calendar.view == 'year') {
      this.calendar.view = 'month';
      this.calendar.dateFormat = 'yy/mm';
      this.showDialog();
    } else if (this.calendar.view == 'month') {
      this.calendar.view = 'date';
      this.calendar.dateFormat = 'yy/mm/dd';
      this.showDialog();
    }
  }

  showDialog() {
    setTimeout(() => {
      this.calendar.showOverlay();
      this.calendar.inputfieldViewChild.nativeElement.dispatchEvent(
        new Event('click')
      );
    }, 200);
  }

  onClearClick() {
    this.calendar.view = 'year';
  }
}
