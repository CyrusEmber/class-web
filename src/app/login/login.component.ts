import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {StudentService} from "../service/student.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {LoginService} from "../service/login.service";
import {MessageService} from "../service/message.service";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  checkoutForm = this.formBuilder.group({
    account: '',
    password: ''
  });

  credentials = {username: '', password: ''};

  constructor(
    private formBuilder: FormBuilder,
    private ss: StudentService,
    private http: HttpClient,
    private router: Router,
    private ls: LoginService,
    private ms: MessageService

  ) { }

  ngOnInit(): void {
  }

  login() {
    this.ls.authenticate(this.credentials, () => {
      this.router.navigateByUrl('/');
    });
    return false;
  }

  authenticated() { return this.ls.authenticated; }

  onSubmit(): void {
    // Process checkout data here
    console.warn('Your order has been submitted', this.checkoutForm.value);
    this.checkoutForm.reset();
  }


}
