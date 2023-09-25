import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { socialMedia } from 'src/app/services/contacts.service';

export const FETCH_SOCIAL_MEDIA_START = createAction(
  '[Social Media] FETCH_SOCIAL_MEDIA_START'
);

export const FETCH_SOCIAL_MEDIA_SUCCESS = createAction(
  '[Social Media] FETCH_SOCIAL_MEDIA_SUCCESS',
  props<{ data: socialMedia[]; message: string; status: number }>()
);

export const FETCH_SOCIAL_MEDIA_FAILED = createAction(
  '[Social Media] FETCH_SOCIAL_MEDIA_FAILED',
  props<{ error: HttpErrorResponse }>()
);
