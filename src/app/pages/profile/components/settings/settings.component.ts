import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { socialMedia } from 'src/app/services/contacts.service';
import * as fromSocialMediaActions from '../../../../store/socialMediaStore/socialMedia.action';
import * as fromSocialMediaSelector from '../../../../store/socialMediaStore/socialMedia.selector';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @Output() Branches: EventEmitter<number> = new EventEmitter();

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
}
