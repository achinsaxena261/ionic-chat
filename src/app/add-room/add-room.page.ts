import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'Firebase';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.page.html',
  styleUrls: ['./add-room.page.scss'],
})
export class AddRoomPage implements OnInit {
  data = { roomname:'' };
  nickname = "";
  ref = firebase.database().ref('chatrooms/');
  constructor(public router: Router, public route: ActivatedRoute) { 
  }

  addRoom() {
    let newData = this.ref.push();
    newData.set({
      roomname:this.data.roomname
    });
    this.router.navigate(['room', { nickname: this.nickname }]);
  }

  ngOnInit() {
    this.route.params.subscribe(p=> this.nickname = p.nickname);
  }

}
