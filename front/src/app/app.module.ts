import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpRequestService} from './services/http-request.service';
import {HomeComponent} from './home/home.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        HomeComponent
    ],
    providers: [HttpRequestService],
    bootstrap: [AppComponent]
})
export class AppModule {}
