import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { PushNotificationsModule } from 'ng-push';

@NgModule({
    imports: [
        BrowserModule, 
        FormsModule, 
        HttpClientModule,
        PushNotificationsModule 
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
