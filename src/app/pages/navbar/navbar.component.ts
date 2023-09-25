import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import { socialMedia } from 'src/app/services/contacts.service';
import { LOGOUT_START} from 'src/app/store/authStore/auth.action';
import { ILoginState } from 'src/app/store/authStore/auth.reducer';
import { loginSelector } from 'src/app/store/authStore/auth.selector';
import * as fromSocialMediaSelector from '../../store/socialMediaStore/socialMedia.selector';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  login$!: Observable<ILoginState>;
  social$: Observable<socialMedia[] | null>;

  constructor(private _Store: Store,
    private _I18nService:I18nService,
    public translate: TranslateService
    ) {
    this.login$ = _Store.select(loginSelector);
    this.social$ = this._Store.select(fromSocialMediaSelector.socialMediaSelector);
  }

  logOut() {
    this._Store.dispatch(LOGOUT_START());
  }

  changeLang(){
    const LANG = this.translate.currentLang || this.translate.defaultLang
    this._I18nService.changeCurrentLang(this.translate, LANG == 'en' ? 'ar':'en');
  }
}
