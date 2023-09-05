import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IEmirateAppointmentsResponse,IClinicStep1Form } from 'src/app/interfaces/clinic.interface';
import { FETCH_CLINIC_EMIRATES_START } from 'src/app/store/clinicStore/clinic.action';
import { clinicEmirateSelector } from 'src/app/store/clinicStore/clinic.selector';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit, OnDestroy {
  emirates$: Observable<IEmirateAppointmentsResponse[] | null>;
  private destroyed$: Subject<void> = new Subject();
  clinicForm: FormGroup = new FormGroup({});
  @Output() formSubmitted = new EventEmitter<any>();
  @Input() formSubmitted2!: IClinicStep1Form;

  constructor(private _FormBuilder: FormBuilder, private _Store: Store) {
    this.emirates$ = _Store.select(clinicEmirateSelector);
    this.emirates$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      res || this._Store.dispatch(FETCH_CLINIC_EMIRATES_START());
    });
  }

  ngOnInit(): void {
    this.setClinicForm();
    if (this.formSubmitted2 != undefined) {
      this.clinicForm.patchValue(this.formSubmitted2);
    }
  }

  setClinicForm() {
    this.clinicForm = this._FormBuilder.group({
      first_name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone_number: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[\\d]{10}$'),
      ]),
      emirate_id: new FormControl(null, [Validators.required]),
      whatsApp: new FormControl(null, [Validators.required,Validators.pattern('^[\\d]{10}$')]),
      address: new FormControl(null, [Validators.required]),
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this.formSubmitted.emit(form.value);
    }
  }
}
