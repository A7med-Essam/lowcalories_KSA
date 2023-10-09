import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { Calendar } from 'primeng/calendar';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],
})
export class PersonalInformationComponent implements OnInit {
  genderType: string[] = ['male', 'female'];
  user!: any;
  isCompleted: boolean = false;
  isEditable: boolean = false;
  CompleteProfileForm: FormGroup = new FormGroup({});
  EditProfileForm: FormGroup = new FormGroup({});
  isLoaded: boolean = true;
  maxBirthdate: Date;
  minBirthdate: Date;
  constructor(
    private _FormBuilder: FormBuilder,
    private _ProfileService: ProfileService,
    public translate: TranslateService
  ) {
    this.maxBirthdate = new Date('2015-12-31');
    this.minBirthdate = new Date('1940-01-01');
  }

  ngOnInit(): void {
    this.getUserInfo();
    this.setCompleteProfileForm();
    this.setEditProfileForm();
  }

  getUserInfo() {
    this._ProfileService
      .getUserInfo()
      .subscribe((res: any) => {
        this.user = res.data;
        this.isLoaded = false;
      });
  }

  setCompleteProfileForm() {
    this.CompleteProfileForm = this._FormBuilder.group({
      date_of_birth: new FormControl(null, [Validators.required]),
      height: new FormControl(null, [Validators.required]),
      weight: new FormControl(null, [Validators.required]),
      second_mobile: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
    });
  }

  setEditProfileForm() {
    this.EditProfileForm = this._FormBuilder.group({
      date_of_birth: new FormControl(
        new Date(this.user?.profile.date_of_birth),
        [Validators.required]
      ),
      height: new FormControl(this.user?.profile.height, [Validators.required]),
      weight: new FormControl(this.user?.profile.weight, [Validators.required]),
      second_mobile: new FormControl(this.user?.profile.second_mobile, [
        Validators.required,
      ]),
      gender: new FormControl(this.user?.profile.gender, [Validators.required]),
      name: new FormControl(this.user?.name, [Validators.required]),
      email: new FormControl(this.user?.email, [
        Validators.required,
        Validators.email,
      ]),
      mobile: new FormControl(this.user?.mobile, [Validators.required]),
    });
  }

  onSubmit(data: FormGroup) {
    this.CompleteProfileForm.controls['date_of_birth'].setValue(
      new Date(data.get('date_of_birth')?.value).toLocaleDateString('en-CA')
    );
    if (data.valid) {
      this._ProfileService
        .updateProfile(data.value)
        .subscribe((res: any) => {
          this.getUserInfo();
          this.isCompleted = false;
        });
    }
  }

  onSubmitEdit(data: FormGroup) {
    this.EditProfileForm.controls['date_of_birth'].setValue(
      new Date(data.get('date_of_birth')?.value).toLocaleDateString('en-CA')
    );
    if (data.valid) {
      this._ProfileService
        .updateProfile(data.value)
        .subscribe((res: any) => {
          if (res.status == 1) {
            this.getUserInfo();
            this.isEditable = false;
          }
        });
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
