import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ContactsService } from 'src/app/services/contacts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  EmailForm: FormGroup = new FormGroup({});
  sendMailBtnStatus: boolean = false;
  constructor(
    private _FormBuilder: FormBuilder,
    private _ContactsService: ContactsService,
    private translate:TranslateService
  ) {}

  ngOnInit(): void {
    this.setEmailForm();
  }

  setEmailForm() {
    this.EmailForm = this._FormBuilder.group({
      name: new FormControl(null, [Validators.required]),
      mobile: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      subject: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit(data: FormGroup) {
    if (data.valid) {
      this.sendMailBtnStatus = true;
      this._ContactsService.sendContactMail(data.value).subscribe((res) => {
        this.sendMailBtnStatus = false;
        if (res.status == 1) {
          this.EmailForm.reset();
          this.fireSwal(res.message, true);
        } else {
          this.fireSwal(res.message, false);
        }
      });
    }
  }

  fireSwal(message: string, status: boolean) {
    Swal.fire({
      icon: status ? 'success' : 'error',
      title: this.translate.currentLang == 'ar'? "خدمة البريد":'Mail Service',
      text: message,
      confirmButtonText: this.translate.currentLang == 'ar'? "حسنا":'OK',
    });
  }
}
