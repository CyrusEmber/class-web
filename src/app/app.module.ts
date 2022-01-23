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
import { BottomBarComponent } from './bottom-bar/bottom-bar.component';
import { HelperComponent } from './helper/helper.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { StudentsComponent } from './students/students.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HttpClientModule } from '@angular/common/http';
import { StudentModifyComponent } from './student-modify/student-modify.component';
import { StudentSearchComponent } from './student-search/student-search.component';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';





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
    CalendarHeaderComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
