import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController, ToastController } from 'ionic-angular';

import { VarsService } from './../services/vars';
import { UtilService } from './../services/util';

import { ProfilePage } from './../profile/profile';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  private userPhraseURI: string;
  private userTimerURI: string;

  public igDbObservable: Observable<{}>;
  public subscriptionHandle: any;
  public loaderHandle: any;
  public presetPhrases: any;

  constructor(
    public navCtrl: NavController,
    public vars: VarsService,
    public afDatabase: AngularFireDatabase,
    public util: UtilService,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {

    this.userPhraseURI = "/igInfo/" + this.vars.getUserLoginInfo().id + "/phrases";
    this.userTimerURI = "/igInfo/" + this.vars.getUserLoginInfo().id + "/timers/" + this.vars.tempThreadKey;
    this.presetPhrases = this.vars.getUserPhrases();
    console.log(this.userTimerURI);
    //this.setPhrase();
  }

  ionViewDidLoad() {
    console.log("Page Loaded");
  }

  ionViewWillLeave() {
    
    if(this.vars.tempThread.autoTimer) {

      this.setTimer(this.vars.autoTimerDefaultValue);
    }
  }

  goToProfile() {

    this.navCtrl.push(ProfilePage);
  }

  setPhrase(phrase: string): any {

    let res = this.afDatabase.list(this.userPhraseURI).push({ phrase: phrase });
    return res;
  }

  setTimer(duration: any): void {

    let res = this.afDatabase.object(this.userTimerURI).set({
      duration: duration,
      timeSet: Date.now()
    });

    if (res) {

      //this.labelColor = label;
      this.vars.toggleAutoTimer(false);
      this.presentToast("Timer was successfully set");
    } else {

      this.presentToast("Timer was not set.");
    }
  }

  preparePhraseActionSheetButtons(): any[] {

    let tempArray: any[] = [];
    this.presetPhrases = this.vars.getUserPhrases();
    let tempObj = {
      text: "Add Phrase.",
      icon: "add-circle",
      role: 'cancel',
      handler: () => {
        console.log('Archive clicked');
        this.addPhrase();
      }
    }
    tempArray.push(tempObj);
    if (this.presetPhrases.length > 0) {
      for (let i = 0; i < this.presetPhrases.length; i++) {

        let tempObj = {
          text: this.presetPhrases[i].phrase,
          icon: "text",
          handler: () => {
            console.log('Archive clicked');
          }
        }
        tempArray.push(tempObj);
      }
    } else {

      let tempObj = {
        text: "Empty Phrase List.",
        icon: "alert",
        role: 'cancel',
        handler: () => {
          console.log('Archive clicked');
        }
      }
      tempArray.push(tempObj);
    }
    return tempArray;
  }

  presentPhraseActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Phrase',
      buttons: this.preparePhraseActionSheetButtons()
    });

    actionSheet.present();
  }

  presentTimerActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Timer',
      buttons: [
        {
          text: '20 Minutes',
          icon: "time",
          handler: () => {
            console.log('20mins Clicked');
            this.setTimer(20 * 60 * 1000);
          }
        },
        {
          text: '1 Hour',
          icon: "time",
          handler: () => {
            console.log('1hr Clicked');
            this.setTimer(60 * 60 * 1000);
          }
        },
        {
          text: '4 Hours',
          icon: "time",
          handler: () => {
            console.log('4hrs clicked');
            this.setTimer(4 * 60 * 60 * 1000);
          }
        },
        {
          text: '12 Hours',
          icon: "time",
          handler: () => {
            console.log('12hrs clicked');
            this.setTimer(12 * 60 * 60 * 1000);
          }
        },
        {
          text: '24 Hours',
          icon: "time",
          handler: () => {
            console.log('24hrs clicked');
            this.setTimer(24 * 60 * 60 * 1000);
          }
        },
        {
          text: '3 Days',
          icon: "time",
          handler: () => {
            console.log('3days clicked');
            this.setTimer(3 * 24 * 60 * 60 * 1000);
          }
        },
        {
          text: '7 Days',
          icon: "time",
          handler: () => {
            console.log('7days clicked');
            this.setTimer(7 * 24 * 60 * 60 * 1000);
          }
        },
        {
          text: '1 Month',
          icon: "time",
          handler: () => {
            console.log('1month clicked');
            this.setTimer(30 * 24 * 60 * 60 * 1000);
          }
        },
        {
          text: 'Clear Timer',
          icon: "refresh-circle",
          handler: () => {
            console.log('Clear Timer clicked');
            this.setTimer(null);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close-circle',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }


  addPhrase() {
    let alert = this.alertCtrl.create({
      title: 'Add Phrase',
      inputs: [
        {
          name: 'phrase',
          placeholder: 'Enter New Phrase'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            console.log(data);
            if (data.phrase && data.phrase.length > 5) {

              if (this.setPhrase(data.phrase)) {

                this.presentToast("Phrase was added successfully");
              } else {

                this.presentToast("Phrase was not added.");
              }
            } else {

              this.presentToast("Phrase is invalid or too short.");
              return false;
            }
          }
        }
      ]
    });
    alert.present();
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
