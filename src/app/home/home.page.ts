import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'Firebase';
import { from } from 'rxjs';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  ngOnInit(): void {
    this.route.params.subscribe(d=> this.setValues(d));
  }
  data = { type:'', nickname:'', message:'', audit: 0 };
  basePath: string = 'uploads';
  chats = [];
  roomkey:string;
  roomname: string;
  nickname:string;
  offStatus:boolean = false;
  fileUrl: any = null;
  respData: any;
  constructor(public router: Router, public route: ActivatedRoute) {
  }

  setValues(resp: any){
    this.roomkey = resp.key;
    this.nickname = resp.nickname;
    this.roomname = resp.room
    this.data.type = 'message';
    this.data.nickname = this.nickname;    
    let joinData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    joinData.set({
      type:'join',
      user:this.nickname,
      message:this.nickname+' has joined this room.',
      sendDate:Date()
    });
    this.data.message = '';
  
    firebase.database().ref('chatrooms/'+this.roomkey+'/chats').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
      setTimeout(() => {
        if(this.offStatus === false) {
          let content = document.querySelector(".chat-content");
          content.scrollTop = content.scrollHeight;
        }
      }, 1000);
    });    
  }

  sendMessage() {
    //perform audit before this
    let newData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    newData.set({
      type:this.data.type,
      user:this.data.nickname,
      message:this.data.message,
      audit: 0,
      sendDate:Date()
    });
    this.data.message = '';
  } 

  exitChat() {
    let exitData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    exitData.set({
      type:'exit',
      user:this.nickname,
      message:this.nickname+' has exited this room.',
      sendDate:Date()
    });
  
    this.offStatus = true;
  
    this.router.navigate(['room', { nickname: this.nickname}]);
  }

  UploadImage(image: File){
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${image.name}`).put(image);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        console.log(uploadTask.snapshot.bytesTransferred/uploadTask.snapshot.totalBytes * 100);
      },
      (error) => {
        console.log(error);
      },
      ()=>{
        let newData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
        //perform audit before this
        newData.set({
          type:'image',
          user:this.data.nickname,
          message:this.data.message,
          imgUrl: uploadTask.snapshot.downloadURL,
          audit: 0,
          sendDate:Date()
      });
      this.data.message = '';
    });
}


  Upload(event) {
    let files = event.target.files;
    for(let i=0;i<files.length;i++){
      this.UploadImage(files[i]);
        this.chats.push({
          type:'image',
          user:this.data.nickname,
          message:this.data.message,
          imgUrl: '../../assets/icon/uploading.gif',
          audit: 0,
          sendDate:Date()
        });
      }
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
}
