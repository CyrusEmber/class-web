import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from "./user/user.component";
import { HelperComponent } from "./helper/helper.component";
import { UserInfoComponent } from "./user-info/user-info.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { StudentsComponent } from "./students/students.component";
import { StudentDetailComponent } from "./student-detail/student-detail.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { StudentModifyComponent } from "./student-modify/student-modify.component";
import { ServiceResolverService } from "./service/service-resolver.service";
import { LoginAuthComponent } from "./auth/login-auth/login-auth.component";
import {AuthGuard} from "./auth/auth.guard";

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'users', component: UserComponent },
  { path: 'helper', component: HelperComponent},
  { path: 'detail/:id', component: StudentDetailComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'student', component: StudentsComponent },
  { path: 'calendar', component: CalendarComponent, resolve: { events: ServiceResolverService } },
  { path: 'modify', component: StudentModifyComponent },
  { path: 'admin', component: LoginAuthComponent, canActivate: [AuthGuard],
    children:[
      { path:'',
      children:[
        { path: 'calendar', component: CalendarComponent}]
    }]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
