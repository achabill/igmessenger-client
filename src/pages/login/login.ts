import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { HomePage } from './../home/home'

import { VarsService } from './../services/vars';
import { UtilService } from './../services/util';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public igDbObservable: Observable<{}>;
  public subscriptionHandle: any;
  public loaderHandle: any;
  public loading;
  public loginData: any = {

    username: "",
    password: "",
    message: "Please enter your IG credentials",
    isMessageError: false
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afDatabase: AngularFireDatabase,
    public util: UtilService,
    public vars: VarsService,
    public loadingCtrl: LoadingController
  ) {

    this.resetLoginData();
    //console.log(CryptoJS.MD5("BENZ45xxx").toString());
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
  }


  resetLoginData() {

    this.loginData = {

      username: "",
      password: "",
      message: "Please enter your IG credentials",
      isMessageError: false
    }
  }

  setLoginError(isError: boolean, msg: string): void {

    this.loginData.message = msg;
    this.loginData.isMessageError = isError;
  }

  validateLoginData(): boolean {

    if (this.loginData.username) {
      if (this.loginData.password) {

        this.setLoginError(false, "Please wait..., Loggin you in.");
        return true;
      } else {

        this.setLoginError(true, "Please enter a Password.");
        return false;
      }
    } else {

      this.setLoginError(true, "Please enter a Username.");
      return false;
    }
  }

  getUserFirebaseLoginStatus(dataObj: any): boolean {
    if (!dataObj) {
      this.setLoginError(true, "Invalid Username/Password or User is not loggedin.");
      return false;
    }
    let dataArray = this.util.objToArray(dataObj);
    for (let i = 0; i < dataArray.length; i++) {

      if ((this.loginData.username == dataArray[i].username) && (CryptoJS.MD5(this.loginData.password).toString() == dataArray[i].password) && dataArray[i].isLoggedIn) {

        this.vars.setUserLoginInfo(dataArray[i]);
        return true;
      }
    }

    this.setLoginError(true, "Invalid Username/Password or User is not loggedin.");
    return false;
  }

  login() {

    if (this.validateLoginData()) {
      this.presentLoadingDefault();
      //this.loaderHandle = this.showLoading("Getting Transactions...");
      this.igDbObservable = this.afDatabase.object("/loginInfo").valueChanges();
      this.subscriptionHandle = this.igDbObservable.subscribe((data) => {

        if (this.getUserFirebaseLoginStatus(data)) {

          this.navCtrl.push(HomePage);
          //console.log(this.util.objToArray(data), CryptoJS.MD5("hello how are you doing"));
          this.loading.dismiss();
        } else {
          this.loading.dismiss();
        }
        this.subscriptionHandle.unsubscribe();
      });
    }
  }
}
