import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/services/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  CurrentPassword!: string;
  NewPassword!: string;
  ConfirmNewPassword!: string;
  private destroyed$: Subject<void> = new Subject();

  constructor(
    private _ProfileService: ProfileService,
    private config: PrimeNGConfig,
    private translate: TranslateService
  ) {}
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  ngOnInit(): void {
    this.translate.onLangChange
    .pipe(takeUntil(this.destroyed$))
    .subscribe((event: LangChangeEvent) =>{
      if (this.translate.currentLang == 'ar') {
        this.config.setTranslation({
          weak: 'ضعيف',
          medium: 'متوسط',
          strong: 'قوي',
          passwordPrompt: 'أختار كلمه سر',
        });
      } else {
        this.config.setTranslation({
          weak: 'Week',
          medium: 'Medium',
          strong: 'Strong',
          passwordPrompt: 'Choose password',
        });
      }
      this.translate
        .get('primeng')
        .subscribe((res) => this.config.setTranslation(res));
    })
  }

  resetPassword() {
    let password: any = {
      old_password: this.CurrentPassword,
      password: this.NewPassword,
      password_confirmation: this.ConfirmNewPassword,
    };
    this._ProfileService.resetPassword_profile(password).subscribe(res=>{
      if (res.status) {
        this.fireSwal(res.message, true);
      }
    });
  }

  confirmPasswordMatch: boolean = false;
  checkPassword(e: any) {
    if (this.NewPassword != e) {
      this.confirmPasswordMatch = true;
    } else {
      this.confirmPasswordMatch = false;
    }
  }

  fireSwal(message: string, status: boolean) {
    Swal.fire({
      icon: status ? 'success' : 'error',
      title: this.translate.currentLang == 'ar'? "خدمة تغير الباسورد":'Change Passowrd Service',
      text: message,
      confirmButtonText: this.translate.currentLang == 'ar'? "حسنا":'OK',
    });
  }
}
