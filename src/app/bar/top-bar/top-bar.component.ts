import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../service/login.service";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  public now: Date = new Date();

  constructor(private ls: LoginService) {
    setInterval(() => {
    this.now = new Date();
  }, 1);
  }

  authenticated(): boolean {
    return this.ls.authenticated;
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.ls.logout();
  }

  title = 'Yue\'s English Class';

}
