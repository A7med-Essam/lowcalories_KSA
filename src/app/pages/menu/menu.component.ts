import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {  Observable, Subject, takeUntil } from 'rxjs';
import {  IMenuResponse } from 'src/app/interfaces/menu.interface';
import { SharedService } from 'src/app/services/shared.service';
import { FETCH_MENU_START } from 'src/app/store/menuStore/menu.action';
import {
  menuLoadingSelector,
  menuSelector,
} from 'src/app/store/menuStore/menu.selector';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  skeletonMode$: Observable<boolean | null>;
  menu$: Observable<IMenuResponse[] | null>;
  private destroyed$: Subject<void> = new Subject();
  category_index: number = 0;
  carouselVisible:boolean = true;

  constructor(private _Store: Store, private _SharedService:SharedService, public translate:TranslateService) {
    this.menu$ = this._Store.select(menuSelector);
    this.skeletonMode$ = this._Store.select(menuLoadingSelector);
    this.menu$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      res || this._Store.dispatch(FETCH_MENU_START())
    });
    if (this.translate.currentLang == 'ar') {
      this.categoryOptions.rtl = true;
    }

    this.translate.onLangChange.pipe(takeUntil(this.destroyed$)).subscribe(res=>{
      if (res.lang == 'ar') {
        this.categoryOptions.rtl = true;
      }else{
        this.categoryOptions.rtl = false;
      }
      this.carouselVisible = false;

      setTimeout(() => {
        this.carouselVisible = true;
      });
  
    })
  }


  ngOnInit(): void {}

  toggleCategories(e: Event, index: number) {
    this.category_index = index;
    this._SharedService.toggleCategories(e);
  }

  categoryOptions: OwlOptions = {
    nav: false,
    margin: 20,
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  };

  // parseAndCalculatePrices(input:string){
  //   // Split the string into individual lines
  //   const lines = input.split('\n');

  //   // Extract data and manipulate
  //   const extractedData = lines.map(line => {
  //     const parts = line.split(' => ');
  //     if (parts.length == 2) {
  //       const gmPart = parts[0];
  //       const pricePart = parts[1];
  
  //       const gmQuantity = parseInt(gmPart.split(' ')[0]);
  //       const gmUnit = gmPart.split(' ')[1];
  
  //       const price = parseInt(pricePart.split(' ')[0]);
  //       const currency = pricePart.split(' ')[1];
  
  //       return {
  //         gmQuantity,
  //         gmUnit,
  //         price,
  //         currency
  //       };
  //     } else {
  //       const gmPart = parts[0];
  //       const pcsPart = parts[1];
  //       const pricePart = parts[2];
  
  //       const gmQuantity = parseInt(gmPart.split(' ')[0]);
  //       const gmUnit = gmPart.split(' ')[1];
  
  //       const pcsQuantity = parseInt(pcsPart.split(' ')[0]);
  //       const pcsUnit = pcsPart.split(' ')[1];
  
  //       const price = parseInt(pricePart.split(' ')[0]);
  //       const currency = pricePart.split(' ')[1];
  
  //       return {
  //         gmQuantity,
  //         gmUnit,
  //         pcsQuantity,
  //         pcsUnit,
  //         price,
  //         currency
  //       };
  //     }
  //   });

  //   return extractedData
  // }

  parseAndCalculatePrices(input: string) {
    // Split the string into individual lines
    const lines = input.split('\n');
  
    // Extract data and manipulate
    const extractedData = lines.map(line => {
      const parts = line.split(' => ');
      const gmPart = parts[0];
      const pricePart = parts[parts.length - 1]; 
  
      const gmQuantity = parseInt(gmPart.split(' ')[0]);
      const gmUnit = gmPart.split(' ')[1];
      const price = parseInt(pricePart.split(' ')[0]);
      const currency = pricePart.split(' ')[1];
  
      if (parts.length === 2) {
        return {
          gmQuantity,
          gmUnit,
          price,
          currency
        };
      } else {
        const pcsPart = parts[1];
        const pcsQuantity = parseInt(pcsPart.split(' ')[0]);
        const pcsUnit = pcsPart.split(' ')[1];
  
        return {
          gmQuantity,
          gmUnit,
          pcsQuantity,
          pcsUnit,
          price,
          currency
        };
      }
    });

    return extractedData;
  }
  

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
