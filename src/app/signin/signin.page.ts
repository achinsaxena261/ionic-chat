import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  data = { nickname:"" };
  constructor(public router: Router) { }

  ngOnInit() {
  }
  enterNickname() {
    this.router.navigate(['room', this.data]);
  }

}
