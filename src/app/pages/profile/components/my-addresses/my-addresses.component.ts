import { Component, ElementRef, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/services/shared.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-my-addresses',
  templateUrl: './my-addresses.component.html',
  styleUrls: ['./my-addresses.component.scss'],
  providers: [ConfirmationService],
})
export class MyAddressesComponent implements OnInit {
  Addresses: any[] = [];
  addNewAddressModal: boolean = false;
  editAddressModal: boolean = false;
  AddressForm: FormGroup = new FormGroup({});
  editAddressForm: FormGroup = new FormGroup({});
  emirate: any[] = [];
  Areas: any[] = [];
  showSkeleton: boolean = true;

  constructor(
    private _ProfileService: ProfileService,
    private confirmationService: ConfirmationService,
    private el: ElementRef,
    private _FormBuilder: FormBuilder,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getAddresses();
    this.createInsertForm();
    this.createUpdateForm();
    this.getStates();
  }

  createInsertForm() {
    this.AddressForm = this._FormBuilder.group({
      address: new FormControl(null, Validators.required),
      area_id: new FormControl(null, Validators.required),
      state_id: new FormControl(null, Validators.required),
    });
  }

  createUpdateForm() {
    this.editAddressForm = this._FormBuilder.group({
      address: new FormControl(null, Validators.required),
      address_id: new FormControl(null, Validators.required),
      area_id: new FormControl(null, Validators.required),
      state_id: new FormControl(null, Validators.required),
    });
  }

  addNewAddress(data: FormGroup) {
    if (data.valid) {
      this.addNewAddressModal = false;
      this._ProfileService.createAddress(data.value).subscribe((res: any) => {
        this.getAddresses();
      });
    }
  }

  getAddresses() {
    this._ProfileService.getAddresses().subscribe((res: any) => {
      this.showSkeleton = false;
      this.Addresses = [...res.data];
      if (this.translate.currentLang == 'ar') {
        this.Addresses.forEach((e) => {
          e.area.state.name = e.area.state.name_ar;
          e.area.area_en = e.area.area_ar;
        });
      }
    });
  }

  confirm(AddressesId: number) {
    setTimeout(() => {
      if (this.translate.currentLang == 'ar') {
        let dialogBtn1 = this.el.nativeElement.querySelector(
          '.p-confirm-dialog-reject .p-button-label'
        );
        dialogBtn1.textContent = 'الرجوع';
        let dialogBtn2 = this.el.nativeElement.querySelector(
          '.p-confirm-dialog-accept .p-button-label'
        );
        dialogBtn2.textContent = 'حذف';
      } else {
        let dialogBtn1 = this.el.nativeElement.querySelector(
          '.p-confirm-dialog-reject .p-button-label'
        );
        dialogBtn1.textContent = 'Back';
        let dialogBtn2 = this.el.nativeElement.querySelector(
          '.p-confirm-dialog-accept .p-button-label'
        );
        dialogBtn2.textContent = 'Delete';
      }
    }, 1);
    if (this.translate.currentLang == 'ar') {
      this.confirmationService.confirm({
        message: 'هل أنت متأكد أنك تريد حذف هذا العنوان؟',
        accept: () => {
          this._ProfileService
            .deleteAddress(AddressesId)
            .subscribe((res: any) => {
              this.getAddresses();
            });
        },
      });
    } else {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this address?',
        accept: () => {
          this._ProfileService
            .deleteAddress(AddressesId)
            .subscribe((res: any) => {
              this.getAddresses();
            });
        },
      });
    }
  }

  getAllAreas(emirate_id: HTMLInputElement) {
    this.Areas = [];
    this._ProfileService
      .getAreas(Number(emirate_id.value))
      .subscribe((res: any) => {
        res.data.forEach((Area: any) => this.Areas.push(Area));
      });
  }

  getStates() {
    this.emirate = [];
    this._ProfileService
      .getEmirates()
      .subscribe((res: any) => {
        res.data.forEach((Emirate: any) => this.emirate.push(Emirate));
      });
  }

  editAddress(data: FormGroup) {
    if (data.valid) {
      this._ProfileService.updateAddress(data.value).subscribe((res: any) => {
        this.getAddresses();
      });
    }
  }

  currentUpdatedRow:any;
  displayUpdateModal(row: any) {
    this.currentUpdatedRow = row;
    this.editAddressModal = true;
    this.editAddressForm.patchValue({
      address: row.address,
      address_id: row.id,
      area_id: row.area.id,
      state_id: row.area.state.id,
    });
  }
}
