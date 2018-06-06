import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';

import { VarsService } from './../services/vars';
import { UtilService } from './../services/util';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/timeout'

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  public igDbObservable: Observable<{}>;
  public subscriptionHandle: any;
  public loaderHandle: any;
  public labelColor: string = "LabelClear";
  public currentUserData: any = {};

  private userLabelURI: string;

  constructor(
    public navCtrl: NavController,
    public vars: VarsService,
    public afDatabase: AngularFireDatabase,
    public util: UtilService,
    public toastCtrl: ToastController,
    public http: Http
  ) {

    this.userLabelURI = "/igInfo/" + this.vars.getUserLoginInfo().id + "/labels/" + this.vars.tempThreadKey;
    if (this.vars.tempThread.loadedData) {

      this.currentUserData = this.vars.tempThread.loadedData;
    } else {

      this.getuserInfo(this.vars.tempThread.users[0].pk);
    }
  }

  ionViewDidLoad() {
    //console.log(this.userLabelURI);
  }

  setLabel(label: string): void {

    let res = this.afDatabase.object(this.userLabelURI).set({ label: label });
    if (res) {

      this.vars.tempThread.labelColor = label;
      this.presentToast("Label was successfully set");
    } else {

      this.presentToast("Label was not set.");
    }
  }

  presentToast(str: string) {
    let toast = this.toastCtrl.create({
      message: str,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      //console.log('Dismissed toast');
    });

    toast.present();
  }

  getuserInfo(pk: string) {

    this.http.get(
      this.vars.getUserEndPoint() + "?userId=" + pk
    ).timeout(30000).subscribe((data: any) => {

      //console.log(JSON.parse(data._body));
      this.currentUserData = JSON.parse(data._body);
      this.vars.tempThread.loadedData = JSON.parse(data._body);
    });
  }
}
