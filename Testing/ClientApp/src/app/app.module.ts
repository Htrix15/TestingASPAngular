import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';


import { DataService } from './services/data.service';

import { registerLocaleData } from '@angular/common';
import ruLocale from '@angular/common/locales/ru';
import { AuthService } from './services/auth-service.service';
import { Provider } from '@angular/compiler/src/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GetErrorsInterceptor } from './interceptors/get-errors.interceptor';
import { MessagesService } from './services/messages.service';
import { AppRoutingModule } from './routing/app-routing.module';
import { SharedModule } from './shared/shared.module';

registerLocaleData(
  ruLocale, 'ru'
)


const INERCEPTOR_ERROR_PROVIDER: Provider ={
  provide: HTTP_INTERCEPTORS,
  useClass: GetErrorsInterceptor,
  multi: true
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    DataService,
    AuthService,
    INERCEPTOR_ERROR_PROVIDER,
    MessagesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
