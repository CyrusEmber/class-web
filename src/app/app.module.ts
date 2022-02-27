import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// calendar import
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BottomBarComponent } from './bar/bottom-bar/bottom-bar.component';
import { HelperComponent } from './helper/helper.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { StudentsComponent } from './students/students.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StudentModifyComponent } from './student-modify/student-modify.component';
import { StudentSearchComponent } from './student-search/student-search.component';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { HttpInterceptorService } from "./service/http-interceptor.service";
import { LoginAuthComponent } from './auth/login-auth/login-auth.component';
import { TopBarComponent } from './bar/top-bar/top-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    BottomBarComponent,
    HelperComponent,
    UserInfoComponent,
    LoginComponent,
    RegisterComponent,
    StudentsComponent,
    StudentDetailComponent,
    MessagesComponent,
    CalendarComponent,
    StudentModifyComponent,
    StudentSearchComponent,
    CalendarHeaderComponent,
    LoginAuthComponent,
    TopBarComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }


