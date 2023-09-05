import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import { IClinicStep1Form } from 'src/app/interfaces/clinic.interface';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent implements OnInit {
  currIndex: number = 1;
  Step1Form!:IClinicStep1Form;
  @ViewChild('indicators') indicators!: ElementRef;
  @ViewChild('progressElm') progressElm!: ElementRef;
  constructor(
    private _I18nService: I18nService,
    public translate: TranslateService
  ) {
    this._I18nService.getCurrentLang(this.translate);
  }

  ngOnInit(): void {}

  next() {
    this.currIndex++;
    this.indicators.nativeElement.children[
      this.currIndex
    ].style.transitionDelay = '0.6s';
    this.indicators.nativeElement.children[this.currIndex].classList.add(
      'completed'
    );
    this.progressElm.nativeElement.style.width = `${
      ((this.currIndex - 1) /
        (this.indicators.nativeElement.children.length - 2)) *
      100
    }%`;
  }

  previous() {
    this.indicators.nativeElement.children[
      this.currIndex
    ].style.transitionDelay = '0s';
    this.indicators.nativeElement.children[this.currIndex].classList.remove(
      'completed'
    );
    this.currIndex--;
    this.progressElm.nativeElement.style.width = `${
      ((this.currIndex - 1) /
        (this.indicators.nativeElement.children.length - 2)) *
      100
    }%`;
  }

  onChildFormSubmit(formData: IClinicStep1Form) {
    this.Step1Form = formData
    this.next()
  }

  onReturn(){
    this.previous()
  }
}

