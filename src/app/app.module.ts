import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ChatPage } from '../pages/chat/chat';
import { ProfilePage } from '../pages/profile/profile';

import { VarsService } from '../pages/services/vars';
import { UtilService } from '../pages/services/util';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
 
 
// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyA6GcvMSujVVXtEXfUsBljM6RtBW3v2dV8",
  authDomain: "instagram-messenger-2c153.firebaseapp.com",
  databaseURL: "https://instagram-messenger-2c153.firebaseio.com",
  projectId: "instagram-messenger-2c153",
  storageBucket: "instagram-messenger-2c153.appspot.com",
  messagingSenderId: "44597154749"
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    ChatPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    ChatPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    VarsService,
    UtilService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
