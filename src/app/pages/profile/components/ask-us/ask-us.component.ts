import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/services/profile.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-ask-us',
  templateUrl: './ask-us.component.html',
  styleUrls: ['./ask-us.component.scss']
})
export class AskUsComponent implements OnInit {
  Questions:any[][] = [];
  Answers!:any[];
  CurrentQuestions:number[] = [];
  CurrentSelectedAnswers:{id:number, SelectedAnswer:string, SelectedAnswer_ar:string}[] = [];
  constructor(
    private _ProfileService:ProfileService,
    private _SharedService:SharedService,
    public translate:TranslateService
  ) { }

  ngOnInit(): void {
    this.getQuestion()
  }

  getQuestion(){
    this._ProfileService.getQuestions().subscribe(
      (res:any)=>{
          this.Questions = [res.data];
      })
  }

  getMoreQuestions(question_id:number){
    if (!this.CurrentQuestions.includes(question_id)) {
      let id: number = this._SharedService.getFormData({
        question_id: question_id,
      }) as any as number;
      this._ProfileService.getAnswers(id).subscribe(
      (res:any)=>{
        this.Questions = [...this.Questions,res.data];
      })
    }
    this.CurrentQuestions.push(question_id);
  }

  getSelectedQuestion(Question:string,id:number,Question_ar:string){
    if(!this.CurrentSelectedAnswers.find( q => q.id == id)){
      this.CurrentSelectedAnswers.push({id:id,SelectedAnswer:Question,SelectedAnswer_ar:Question_ar});
    }
  }

}
