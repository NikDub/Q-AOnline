import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionAndAnswer } from './QuestionAndAnswer';
import { tap } from 'rxjs/operators'
import { interval, Subscription } from 'rxjs'
import { PushNotificationsService } from 'ng-push';

export interface asd {
  id?: number,
  Question?: string,
  Answer?: string
}

export interface PushNotification {
  body ? : string;
  icon ? : string;
  tag ? : string;
  data ? : any;
  renotify ? : boolean;
  silent ? : boolean;
  sound ? : string;
  noscreen ? : boolean;
  sticky ? : boolean;
  dir ? : 'auto' | 'ltr' | 'rtl';
  lang ? : string;
  vibrate ? : number[];
}

@Injectable()
export class DataService {
  public questionsWithAnswer: asd[];
  public questionsWithOutAnswer: asd[];
  public question: QuestionAndAnswer = new QuestionAndAnswer();
  public answeredQuestion: QuestionAndAnswer = new QuestionAndAnswer();
  tmp: QuestionAndAnswer = new QuestionAndAnswer();
  public intervalSub: Subscription;
  public num: number = 0;



  private url = "/api/product";

  constructor(private http: HttpClient, private _pushNotifications: PushNotificationsService, ) {
  }


  public loadQAndA() {
    this.getOnlyQuestion("withAnswerOnly").subscribe((data: QuestionAndAnswer[]) => this.questionsWithAnswer = data);
    this.getOnlyQuestion("withoutAnswer").subscribe((data: QuestionAndAnswer[]) => this.questionsWithOutAnswer = data);
  }


  notifyNewAnswer(some: string){ 
    let options = { 
      body: some,
      icon: "../assets/icons/bell.png " 
    }
     this._pushNotifications.create('New Answer', options).subscribe( 
        res => console.log(res),
        err => console.log(err)
    );
  }

  notifyNewQuestion(some: string){ 
    let options = { 
      body: some,
      icon: "../assets/icons/bell.png " 
    }
     this._pushNotifications.create('New Question', options).subscribe( 
        res => console.log(res),
        err => console.log(err)
    );
  }


  public intervalTimer() {
    this.intervalSub = interval(1000).subscribe(() => this.getQuestionInterval());
  }
  private getQuestionInterval() {
    if (this.num == this.questionsWithOutAnswer.length - 1) {
      this.num = 0;
    }
    else {
      this.num++;
    }
  }

  getQandA(id: number) {
    return this.http.get(this.url + '/' + id);
  }

  getOnlyQuestion(some: string) {
    if(some==="withAnswerOnly")
      return this.http.get<asd[]>(this.url + '/question/' + some).pipe(tap(tmp=> this.questionsWithAnswer=tmp));
    else
      return this.http.get<asd[]>(this.url + '/question/' + some).pipe(tap(tmp=> this.questionsWithOutAnswer=tmp));

  }

  createQandA(qanda: QuestionAndAnswer) {
    return this.http.post(this.url, qanda);
  }
  updateQandA(qanda: QuestionAndAnswer) {

    return this.http.put(this.url, qanda);
  }
  deleteQandA(id: number) {
    return this.http.delete(this.url + '/' + id);
  }
}
