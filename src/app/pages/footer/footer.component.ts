import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { socialMedia } from 'src/app/services/contacts.service';
import * as fromSocialMediaActions from '../../store/socialMediaStore/socialMedia.action';
import * as fromSocialMediaSelector from '../../store/socialMediaStore/socialMedia.selector';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();


  social$: Observable<socialMedia[] | null>;
  private destroyed$: Subject<void> = new Subject();

  constructor(private _Store: Store, public translate:TranslateService) {
    this.social$ = this._Store.select(fromSocialMediaSelector.socialMediaSelector);
    this.social$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      res || this._Store.dispatch(fromSocialMediaActions.FETCH_SOCIAL_MEDIA_START());
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }


}
