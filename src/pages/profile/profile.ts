import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
//import { Http } from '@angular/http';

import { VarsService } from './../services/vars';
import { UtilService } from './../services/util';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  public igDbObservable: Observable<{}>;
  public subscriptionHandle: any;
  public loaderHandle: any;
  public labelColor: string = "LabelClear";

  private userLabelURI: string;

  constructor(
    public navCtrl: NavController, 
    public vars: VarsService,
    public afDatabase: AngularFireDatabase,
    public util: UtilService,
    public toastCtrl: ToastController
    //public http: Http
  ) {

    this.userLabelURI = "/igInfo/"+this.vars.getUserLoginInfo().id+"/labels/"+this.vars.tempThreadKey;
  }

  ionViewDidLoad() {
    console.log(this.userLabelURI);
  }

  setLabel(label: string): void {
    
    let res = this.afDatabase.object(this.userLabelURI).set({label: label});
    if(res){

      this.labelColor = label;
      this.presentToast("Label was successfully set");
    }else{

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
      console.log('Dismissed toast');
    });
  
    toast.present();
  }


}
