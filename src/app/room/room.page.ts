import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'Firebase';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  rooms = [];
  ref = firebase.database().ref('chatrooms/');
  nickname = "";
  constructor(public router: Router, public route: ActivatedRoute) {
    this.ref.on('value', resp => {
      this.rooms = [];
      console.log(resp);
      this.rooms = snapshotToArray(resp);
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(p=> this.nickname = p.nickname);
  }

  addRoom() {
    this.router.navigate(['add-room', { nickname: this.nickname }]);
  }

  joinRoom(key, name) {
    this.router.navigate(['home', {key: key, nickname: this.nickname, room: name}]);
  }

}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};
