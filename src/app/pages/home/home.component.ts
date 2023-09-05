import { Component, OnInit, ViewChild } from '@angular/core';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { AnimationOptions } from 'ngx-lottie';
import { CarouselService } from 'ngx-owl-carousel-o/lib/services/carousel.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {}
  // @ViewChild('carousel', { static: true }) carousel!: CarouselComponent;
  owlRefreshMode:boolean = false
  ngOnInit(): void {
    setTimeout(() => {
      this.owlRefreshMode = true
      // const anyService = this.carousel as any;
      // const carouselService = anyService.carouselService as CarouselService;
      //  carouselService.refresh();
      //  carouselService.update();
    }, 1);
  }


  options: AnimationOptions = {
    path: '../../../assets/lottie/app_store.json'
  };

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    items: 1,
    dots: false,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      }
    }
  }
}
