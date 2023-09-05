import { Component, OnDestroy, OnInit } from '@angular/core';
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
  constructor(private _FormBuilder: FormBuilder, private _Store: Store, private translate:TranslateService) {
    this.maxBirthdate = new Date("2005-12-31")
    this.register$ = _Store.select(registerSelector);

    this.subscribe$ = _Store.select(registerSelector)
    .subscribe(res=>{
      if (res.message !== null && res.status == 0) {
        Swal.fire({
          icon: 'error',
          title: this.translate.currentLang == 'ar'?"أُووبس...":'Oops...',
          text: res.message,
          confirmButtonText: this.translate.currentLang == 'ar'? "تأكيد":'Confirm',
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
      first_name: new FormControl(null, [Validators.required, Validators.max(20), Validators.min(1)]),
      last_name: new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.minLength(1)]),
      phone_number: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      gender: new FormControl(null, [Validators.required]),
      birthday: new FormControl(this.maxBirthdate, [Validators.required]),
      height: new FormControl(null, [Validators.required, Validators.maxLength(3), Validators.minLength(1)]),
      Weight: new FormControl(null, [Validators.required, Validators.maxLength(3), Validators.minLength(1)]),
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
}
