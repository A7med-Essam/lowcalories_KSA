import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, of, catchError } from 'rxjs';
import { ContactsService } from 'src/app/services/contacts.service';
import * as fromSocialMediaActions from './socialMedia.action';

@Injectable()
export class SocialMediaEffects {
  constructor(
    private actions$: Actions,
    private _ContactsService: ContactsService
  ) {}

  socialMediaEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(fromSocialMediaActions.FETCH_SOCIAL_MEDIA_START),
      exhaustMap((action) =>
        this._ContactsService.getSocialMedia().pipe(
          map((res) =>
          fromSocialMediaActions.FETCH_SOCIAL_MEDIA_SUCCESS({
              data: res.data,
              message: res.message,
              status: res.status,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(fromSocialMediaActions.FETCH_SOCIAL_MEDIA_FAILED({ error: error }))
          )
        )
      )
    )
  );
}
