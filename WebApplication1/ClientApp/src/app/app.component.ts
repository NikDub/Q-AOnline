import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './data.service';
import { QuestionAndAnswer } from './QuestionAndAnswer';
import { interval, Subscription } from 'rxjs'
import { HubConnection, HubConnectionBuilder  } from '@aspnet/signalr'
import { PushNotificationsService} from 'ng-push';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [DataService]
})
export class AppComponent implements OnInit, OnDestroy {

  question: QuestionAndAnswer = new QuestionAndAnswer();
  tmp: QuestionAndAnswer = new QuestionAndAnswer();
  questions: QuestionAndAnswer[];
  questionsWithoutAnswer: QuestionAndAnswer[];
  answeredQuestion: QuestionAndAnswer = new QuestionAndAnswer();
  tableMode: boolean = true;
  questionMode: boolean = false;
  num: number = 0;
  intervalSub: Subscription;
  hubConnection: HubConnection;
  hubConnection2: HubConnection;
  constructor(private dataService: DataService, private _pushNotifications: PushNotificationsService) { this._pushNotifications.requestPermission(); }

  ngOnInit() {
    this.loadQAndA();
    this.intervalTimer();
    this.hubConnection= new HubConnectionBuilder().withUrl("/echo").build();
    this.hubConnection.on('send', data=> {this.questionsWithoutAnswer.push(data);this.notifyNewQuestion();});
    this.hubConnection.start().then(()=>console.log('Connected'));

    this.hubConnection2= new HubConnectionBuilder().withUrl("/echo2").build();
    this.hubConnection2.on('send2', data=> {
      console.log(data);
      this.questions.push(data); 
      this.tmp=data;  
      this.questionsWithoutAnswer.splice(this.questionsWithoutAnswer.map(e=>e.id).indexOf(this.tmp.id),1);
      this.notifyNewAnswer();
     });
    this.hubConnection2.start().then(()=>console.log('Connected 2 too'));
    
  }

  ngOnDestroy() {
    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
    }
  }

  public loadQAndA() {
    this.dataService.getOnlyQuestion("withAnswerOnly").subscribe((data: QuestionAndAnswer[]) => this.questions = data);
    this.dataService.getOnlyQuestion("withoutAnswer").subscribe((data: QuestionAndAnswer[]) => this.questionsWithoutAnswer = data);
  }

  public saveAnswer() {
    this.dataService.updateQandA(this.answeredQuestion)
        .subscribe(data => {this.hubConnection2.invoke('Echo2', data);});
  
    this.questionMode = !this.questionMode;
    this.intervalTimer();
  }

  public saveQuestion() {
      this.dataService.createQandA(this.question)
        .subscribe((data: QuestionAndAnswer) => this.hubConnection.invoke('Echo', data));
  }

  public giveAnswer(p: number) {
    this.answeredQuestion = this.questionsWithoutAnswer[p];
    this.questionMode = !this.questionMode;

    if (this.questionMode) {
      if (this.intervalSub) 
        this.intervalSub.unsubscribe();
    }
    else {
      this.intervalTimer();
    }
  }

  public cancel() {
    this.question = new QuestionAndAnswer();
    this.tableMode = true;
  }

  public add() {
    this.tableMode = !this.tableMode;
  }

  notifyNewAnswer(){ 
    let options = { 
      body: this.answeredQuestion.Answer,
      icon: "../assets/icons/bell.png " 
    }
     this._pushNotifications.create('New Answer', options).subscribe( 
        res => console.log(res),
        err => console.log(err)
    );
  }

  notifyNewQuestion(){ 
    let options = { 
      body: this.question.Answer,
      icon: "../assets/icons/bell.png " 
    }
     this._pushNotifications.create('New Question', options).subscribe( 
        res => console.log(res),
        err => console.log(err)
    );
  }

  private intervalTimer() {
    this.intervalSub = interval(1000).subscribe(() => this.getQuestionInterval());
  }

  private getQuestionInterval() {
    if (this.num == this.questionsWithoutAnswer.length-1) {
      this.num = 0;
    }
    else {
      this.num++;
    }
  }
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

//create real-time notification
