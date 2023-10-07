import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-weeks',
  templateUrl: './weeks.component.html',
  styleUrls: ['./weeks.component.scss'],
})
export class WeeksComponent implements OnInit {
  @Input() plan!: any;
  @Input() weeks!: any;
  weeksCount: any[] = [];
  currentWeek: number = 1;

  constructor(private _SharedService: SharedService) {}
  ngOnInit(): void {
    this.getWeeksCount();
  }

  toggleWeeks(e: HTMLElement) {
    e.children[0].classList.add('active');
    const Siblings = this._SharedService.getAllSiblings(e, e.parentElement);
    Siblings.forEach((e: HTMLElement) => {
      e.children[0]?.classList.remove('active');
    });
  }

  getWeeksCount() {
    let output: any[] = [];
    this.plan.subDetails.forEach(function (item: any) {
      var existing = output.filter(function (v, i) {
        return v.weekName == item.weekName;
      });
      if (existing.length) {
      } else {
        output.push(item);
      }
    });
    this.weeksCount = output;
  }
}
