import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IProgramResponse } from 'src/app/interfaces/program.interface';
import * as fromProgramActions from '../../store/programStore/program.action';
import * as fromProgramSelector from '../../store/programStore/program.selector';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss'],
})
export class ProgramComponent implements OnDestroy {
  skeletonMode$: Observable<boolean | null>;
  programs$: Observable<IProgramResponse[] | null>;
  private destroyed$: Subject<void> = new Subject();

  constructor(private _Store: Store, public translate:TranslateService) {
    this.programs$ = this._Store.select(fromProgramSelector.programSelector);
    this.skeletonMode$ = this._Store.select(
      fromProgramSelector.programLoadingSelector
    );
    this.programs$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      res || this._Store.dispatch(fromProgramActions.FETCH_PROGRAM_START());
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
