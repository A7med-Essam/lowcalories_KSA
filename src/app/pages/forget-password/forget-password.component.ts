import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  constructor(private _AuthService: AuthService, private translate:TranslateService) {}
  btnStatus:boolean = false
  ngOnInit(): void {}

  forgetPassword(email: HTMLInputElement) {
    if (email.value != '') {
      this.btnStatus = true;
      this._AuthService.forgetPassword(email.value).subscribe((res) => {
        this.btnStatus = false;
        this.fireSwal(res.message, res.status == 1 ? true : false);
        email.value = ""
      });
    }
  }

  fireSwal(message: string, status: boolean) {
    Swal.fire({
      icon: status ? 'success' : 'error',
      title: this.translate.currentLang == 'ar'? "خدمة إعادة تعيين كلمة المرور":'Reset Password Service',
      text: message,
      confirmButtonText: this.translate.currentLang == 'ar'? "تأكيد":'Confirm',
    });
  }
}
