import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {
  // Emirates:IBranch[] = [];

  @Output() branchId: EventEmitter<number> = new EventEmitter();
  @Output() branchDetails: EventEmitter<number> = new EventEmitter();


  constructor(
    // private _BranchesService:BranchesService,
    // private _SharedService:SharedService,
    // private _I18nService: I18nService,
    // public translate: TranslateService
  ) {
    // this._I18nService.saveCurrentLang(this.translate)
 
  }

  ngOnInit(): void {
    // this.getEmirates()
 
  }
  // getEmirates(){
  //   this._BranchesService.getEmirates().subscribe((res:IBranchResponse)=>{
  //     this.Emirates = [...res.data]
  //     if (this.translate.currentLang == 'ar') {
  //       this.Emirates.map( e =>{
  //         e.name = e.name_ar
  //         e.name_ar = e.name
  //       })
  //     }
  //   })
  // }

  // hover(element:HTMLElement, src:string) {
  //   this._SharedService.hover(element, src)
  // }

  // unhover(element:HTMLElement, src:string) {
  //   this._SharedService.hover(element, src)
  // }

  // getBranchDetails(id:number){
  //   this.branchDetails.emit(13)
  //   this.branchId.emit(id)
  // }
}
