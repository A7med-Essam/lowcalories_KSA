import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { socialMedia } from 'src/app/services/contacts.service';
import { LocalService } from 'src/app/services/local.service';
import { ProfileService } from 'src/app/services/profile.service';
import { SharedService } from 'src/app/services/shared.service';
import * as fromSocialMediaActions from '../../../../store/socialMediaStore/socialMedia.action';
import * as fromSocialMediaSelector from '../../../../store/socialMediaStore/socialMedia.selector';
import * as fromAuthActions from '../../../../store/authStore/auth.action';
import Swal from 'sweetalert2';
import { AnimationOptions } from 'ngx-lottie';
import { loginSelector } from 'src/app/store/authStore/auth.selector';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @Output() Branches: EventEmitter<number> = new EventEmitter();

  social$: Observable<socialMedia[] | null>;
  private destroyed$: Subject<void> = new Subject();

  constructor(
    private _Store: Store,
    public translate: TranslateService,
    private _SharedService: SharedService,
    private _ProfileService:ProfileService,
    private _LocalService:LocalService
    ) {
    this.social$ = this._Store.select(
      fromSocialMediaSelector.socialMediaSelector
    );
    this.social$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      res ||
        this._Store.dispatch(fromSocialMediaActions.FETCH_SOCIAL_MEDIA_START());
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {}

  hover(element: HTMLElement, src: string) {
    element.setAttribute('src', src);
  }

  unhover(element: HTMLElement, src: string) {
    element.setAttribute('src', src);
  }

  getBranches() {
    this.Branches.emit(12);
  }

  importImage() {
    let input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    let base64: any = null;
    input.onchange = () => {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          if (e.target) {
            base64 = e.target;
          }
        };
        reader.readAsDataURL(input.files[0]);
        setTimeout(() => {
          if (input.files) {
            this.updateProfileImage(input.files[0]);
          }
        }, 500);
      }
    };
    input.click();
  }

  updateProfileImage(image: File) {
    this.fireSwal()
    let img: File = this._SharedService.getFormData({ image: image }) as any;
    this._ProfileService.updateProfileImage(img).subscribe((res) => {
      this._LocalService.setJsonValue('lowcalories_KSA',res.data)
      this._Store.dispatch(fromAuthActions.LOGIN_SUCCESS({
        data: this._LocalService.getJsonValue('lowcalories_KSA'),
        message: '',
        status: 1,
      }))
      Swal.close();
    });
  }

    // *****************************************************Swal && Lottie*****************************************************
    uploadSwal: any;
  @ViewChild('lottie') lottie!: ElementRef;
  options: AnimationOptions = {
    path: '../../../../../assets/lottie/upload.json',
  };
    fireSwal() {
      this.uploadSwal = Swal.mixin({
        showConfirmButton: false,
        timerProgressBar: false,
      });
  
      this.uploadSwal.fire({
        html: this.lottie.nativeElement,
      });
    }
}
