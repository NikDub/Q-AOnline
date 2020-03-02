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

  constructor(private dataService: DataService, private _pushNotifications: PushNotificationsService, private data: DataService) { this._pushNotifications.requestPermission(); }
  tableMode: boolean = true;
  questionMode: boolean = false;
  hubConnection: HubConnection;
  hubConnection2: HubConnection;

  ngOnInit() {
    this.dataService.loadQAndA();
    this.dataService.intervalTimer();

    this.hubConnection= new HubConnectionBuilder().withUrl("/echo").build();
    this.hubConnection.on('send', data=> {this.dataService.questionsWithOutAnswer.push(data);});
    this.hubConnection.start().then(()=>console.log('Connected echo'));

    this.hubConnection2= new HubConnectionBuilder().withUrl("/echo2").build();
    this.hubConnection2.on('send2', data=> {
      console.log(data);
      this.dataService.questionsWithAnswer.push(data); 
      this.dataService.tmp=data;  
      this.dataService.questionsWithOutAnswer.splice(this.dataService.questionsWithOutAnswer.map(e=>e.id).indexOf(this.dataService.tmp.id),1);
     });
    this.hubConnection2.start().then(()=>console.log('Connected echo2'));
    
  }
  ngOnDestroy() {
    if (this.dataService.intervalSub) {
      this.dataService.intervalSub.unsubscribe();
    }
  }
  public saveAnswer() {
    this.dataService.updateQandA(this.dataService.answeredQuestion)
        .subscribe(data => {this.hubConnection2.invoke('Echo2', data);});
  
    this.questionMode = !this.questionMode;
    this.dataService.intervalTimer();
  }
  public saveQuestion() {
      this.dataService.createQandA(this.dataService.question)
        .subscribe((data: QuestionAndAnswer) => this.hubConnection.invoke('Echo', data));
    this.tableMode = !this.tableMode;
  }
  public giveAnswer(p: number) {
    this.dataService.answeredQuestion = this.dataService.questionsWithOutAnswer[p];
    this.questionMode = !this.questionMode;

    if (this.questionMode) {
      if (this.dataService.intervalSub) 
        this.dataService.intervalSub.unsubscribe();
    }
    else {
      this.dataService.intervalTimer();
    }
  }
  public cancel() {
    this.dataService.question = new QuestionAndAnswer();
    this.tableMode = true;
  }
  public add() {
    this.tableMode = !this.tableMode;
  }
}
