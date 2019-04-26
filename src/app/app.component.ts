import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// const config = {
//   apiKey: 'AIzaSyB51RbzWXVRE4SFuDBb7n06ZiREAnJb4Js',
//   authDomain: 'ionic-chat-app-fdab5.firebaseapp.com',
//   databaseURL: 'https://ionic-chat-app-fdab5.firebaseio.com/',
//   projectId: 'ionic-chat-app-fdab5',
//   storageBucket: 'gs://ionic-chat-app-fdab5.appspot.com',
// };

const config = {
  apiKey: 'AIzaSyBPKaedrDXz7E6H-SEmINx8JzsOlep9vW4',
  authDomain: 'fakenewsfinderhacks30.firebaseapp.com',
  databaseURL: 'https://fakenewsfinderhacks30.firebaseio.com/',
  projectId: 'fakenewsfinderhacks30',
  storageBucket: 'gs://fakenewsfinderhacks30.appspot.com',
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    firebase.initializeApp(config);
  }
}
