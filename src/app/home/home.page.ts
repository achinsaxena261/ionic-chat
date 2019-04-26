import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'Firebase';
import { from } from 'rxjs';
import { forEach } from '@angular/router/src/utils/collection';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  constructor(public router: Router, public route: ActivatedRoute, public apiService: ApiService) {
  }
  data = { type: '', nickname: '', message: '', audit: 0 };
  basePath = 'uploads';
  chats = [];
  roomkey: string;
  roomname: string;
  nickname: string;
  offStatus = false;
  fileUrl: any = null;
  respData: any;
  isProcessOver: boolean;
  isFakeFound: boolean;
  imgUrlToProcess: string;
  textUrlToProcess: string;
  ngOnInit(): void {
    this.route.params.subscribe(d => this.setValues(d));
  }

  setValues(resp: any) {
    this.roomkey = resp.key;
    this.nickname = resp.nickname;
    this.roomname = resp.room;
    this.data.type = 'message';
    this.data.nickname = this.nickname;
    const joinData = firebase.database().ref('chatrooms/' + this.roomkey + '/chats').push();
    joinData.set({
      type: 'join',
      user: this.nickname,
      message: this.nickname + ' has joined this room.',
      sendDate: Date()
    });
    this.data.message = '';

    firebase.database().ref('chatrooms/' + this.roomkey + '/chats').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
      setTimeout(() => {
        if (this.offStatus === false) {
          const content = document.querySelector('.chat-content');
          content.scrollTop = content.scrollHeight;
        }
      }, 1000);
    });
  }

  sendMessage() {
    // perform audit before this
    const newData = firebase.database().ref('chatrooms/' + this.roomkey + '/chats').push();    
    this.textUrlToProcess = this.data.message;
    this.apiService.processText(this.textUrlToProcess).subscribe((res) => {
      this.isFakeFound = res.isFake;
    // tslint:disable-next-line: no-debugger
      debugger;
      console.log(this.isFakeFound);
      console.log('Text message processed is : ' + this.textUrlToProcess);

      newData.set({
      type: this.data.type,
      user: this.data.nickname,
      message: this.textUrlToProcess, //this.data.message,
      audit: this.isFakeFound ? 1 : 0,
      sendDate: Date()
      });
    });
    this.data.message = '';
  }

  exitChat() {
    const exitData = firebase.database().ref('chatrooms/' + this.roomkey + '/chats').push();
    exitData.set({
      type: 'exit',
      user: this.nickname,
      message: this.nickname + ' has exited this room.',
      sendDate: Date()
    });

    this.offStatus = true;

    this.router.navigate(['room', { nickname: this.nickname}]);
  }

  UploadImage(image: File) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${image.name}`).put(image);
    console.log('image url found :' + uploadTask.snapshot.downloadURL);
    this.imgUrlToProcess = uploadTask.snapshot.downloadURL;

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        console.log(uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes * 100);
      },
      (error) => {
        console.log(error);
      },
      () => {
        const newData = firebase.database().ref('chatrooms/' + this.roomkey + '/chats').push();
        this.apiService.processImage(uploadTask.snapshot.downloadURL).subscribe((res) => {
          this.isFakeFound = res.isFake;
      // tslint:disable-next-line: no-debugger
          debugger;
          console.log(this.isFakeFound);
          console.log('Text inside image is : ' + res.url);

          newData.set({
          type: 'image',
          user: this.data.nickname,
          message: this.data.message,
          imgUrl: uploadTask.snapshot.downloadURL,
          audit: this.isFakeFound ? 1 : 0,
          sendDate: Date()
        });
      });
        this.data.message = '';
    });
}


  Upload(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.UploadImage(files[i]);
      this.chats.push({
          type: 'image',
          user: this.data.nickname,
          message: this.data.message,
          imgUrl: '../../assets/icon/uploading.gif',
          audit: 0,
          sendDate: Date()
        });
      }
    }
  }


export const snapshotToArray = snapshot => {
  const returnArr = [];

  snapshot.forEach(childSnapshot => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};
