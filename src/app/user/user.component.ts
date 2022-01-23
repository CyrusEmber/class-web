import { Component, OnInit } from '@angular/core';
import { User } from "../User";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  hero = 'Windstorm';
  user: User = {
    id: 1,
    password: '1'
  };
  constructor() { }

  ngOnInit(): void {
  }

}
