import { Component, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {
  options: AnimationOptions = {
    path: '../../../assets/lottie/404.json'
  };
  constructor() { }

  ngOnInit(): void {
  }

}
