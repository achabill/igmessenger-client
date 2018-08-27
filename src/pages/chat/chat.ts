import { Component, ViewChild, AfterViewChecked } from '@angular/core';
import { NavController, LoadingController, ActionSheetController, AlertController, ToastController, Content } from 'ionic-angular';
import { Http } from '@angular/http';

import { VarsService } from './../services/vars';
import { UtilService } from './../services/util';

import { ProfilePage } from './../profile/profile';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage implements AfterViewChecked {

  @ViewChild(Content) content: Content;

  private userIgThreadItemURI: string;
  private userPhraseURI: string;
  private userTimerURI: string;
  private likeThreadURI: string;
  private messageURI: string;
  private seenURI: string;
  private msgData: any;
  public loading: any;
  public igDbObservable: Observable<{}>;
  public subscriptionHandle: any;
  public loaderHandle: any;
  public presetPhrases: any;
  public threadItems: any;
  public showSendingLoader: boolean;
  public scrollControl: number;

  constructor(
    public navCtrl: NavController,
    public vars: VarsService,
    public afDatabase: AngularFireDatabase,
    public util: UtilService,
    public http: Http,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {

    this.resetMsgData();
    this.showSendingLoader = false;
    this.userPhraseURI = "/igInfo/" + this.vars.getUserLoginInfo().id + "/phrases";
    this.userTimerURI = "/igInfo/" + this.vars.getUserLoginInfo().id + "/timers/" + this.vars.tempThreadKey;
    this.userIgThreadItemURI = "/igInfo/" + this.vars.getUserLoginInfo().id + "/threadItems/" + this.vars.tempThreadKey;
    this.likeThreadURI = this.vars.serverHostAndPort + this.vars.serverLikeThreadEndpoint + "?threadId=" + this.vars.tempThreadKey;
    this.messageURI = this.vars.serverHostAndPort + this.vars.serverMessageEndpoint + "?threadId=" + this.vars.tempThreadKey + "&text=";
    this.seenURI = this.vars.serverHostAndPort + this.vars.serverSeenEndpoint + "?threadId=" + this.vars.tempThreadKey + "&threadItemId=" + this.vars.tempThread.items[0].item_id;
    this.presetPhrases = this.vars.getUserPhrases();
    this.getThreadItems();
  }

  resetMsgData() {

    this.msgData = {

      text: ""
    }
  }

  ionViewDidLoad() {
    console.log(this.content);
    this.content.scrollDownOnLoad = true;
    //this.scrollToBottom();
  }

  ngAfterViewChecked() {        
    //this.scrollToBottom();        
} 

  ionViewWillLeave() {

    if (this.vars.tempThread.autoTimer) {

      this.setTimer(this.vars.autoTimerDefaultValue);
    }
  }

  testFunction(){

    
  }

  scrollToBottom(val: any): void{
    
    // console.log(val, this.scrollControl);
    // if(this.scrollControl > val){
    //   let dimensions: any;
    //   dimensions = this.content.getContentDimensions();
    //   this.content.scrollTo(0, dimensions.scrollHeight, 0);
    //   this.scrollControl = -1;
    // }
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
      this.vars.tempThread.threadTimer = duration/60000;
      this.presentToast("Timer was successfully set");
    } else {

      this.presentToast("Timer was not set.");
    }
  }

  preparePhraseActionSheetButtons(): any[] {

    let tempArray: any[] = [];
    this.presetPhrases = this.vars.getUserPhrases();
    if (this.presetPhrases.length > 0) {
      for (let i = 0; i < this.presetPhrases.length; i++) {

        let tempObj = {
          text: this.presetPhrases[i].phrase,
          icon: "text",
          handler: () => {

              this.msgData.text = this.presetPhrases[i].phrase
          }
        }
        tempArray.push(tempObj);
      }
    }
    let addPhrase = {
      text: "Add Phrase.",
      icon: "add-circle",
      //role: 'cancel',
      handler: () => {
        this.addPhrase();
      }
    }
    tempArray.push(addPhrase);
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

            this.setTimer(20 * 60 * 1000);
          }
        },
        {
          text: '1 Hour',
          icon: "time",
          handler: () => {

            this.setTimer(60 * 60 * 1000);
          }
        },
        {
          text: '4 Hours',
          icon: "time",
          handler: () => {

            this.setTimer(4 * 60 * 60 * 1000);
          }
        },
        {
          text: '12 Hours',
          icon: "time",
          handler: () => {

            this.setTimer(12 * 60 * 60 * 1000);
          }
        },
        {
          text: '24 Hours',
          icon: "time",
          handler: () => {

            this.setTimer(24 * 60 * 60 * 1000);
          }
        },
        {
          text: '3 Days',
          icon: "time",
          handler: () => {
            //console.log('3days clicked');
            this.setTimer(3 * 24 * 60 * 60 * 1000);
          }
        },
        {
          text: '7 Days',
          icon: "time",
          handler: () => {
            //console.log('7days clicked');
            this.setTimer(7 * 24 * 60 * 60 * 1000);
          }
        },
        {
          text: '1 Month',
          icon: "time",
          handler: () => {
            //console.log('1month clicked');
            this.setTimer(30 * 24 * 60 * 60 * 1000);
          }
        },
        {
          text: 'Clear Timer',
          icon: "refresh-circle",
          handler: () => {
            //console.log('Clear Timer clicked');
            this.setTimer(null);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close-circle',
          handler: () => {
            //console.log('Cancel clicked');
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
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            //console.log(data);
            if (data.phrase && data.phrase.length > 1) {

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
      //console.log('Dismissed toast');
    });

    toast.present();
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
        content: 'Loading threads...'
    });

    this.loading.present();
}


  getThreadItems() {

    this.igDbObservable = this.afDatabase.object(this.userIgThreadItemURI).valueChanges();
    this.presentLoadingDefault();
    this.subscriptionHandle = this.igDbObservable.subscribe((data: any) => {

        console.log(data);
        this.showSendingLoader = false;
        this.declareSeen();
        this.threadItems = data;
        this.scrollControl = this.threadItems.length;
       
        this.loading.dismiss();
    });
  }

  parseDateObj(tStamp: any) {

    //var tStamp = parseInt(tStamp)*1000;
    var newDateObject = new Date(parseInt(tStamp) / 1000);
    //EEEE, MMMM dd MMM yyyy @HH:mm:ss
    return newDateObject;
  }

  showUsername(id: string): string {

    if (id == this.vars.tempThread.users[0].pk){

      return this.vars.tempThread.users[0].username;
    }else{

      return this.vars.getUserLoginInfo().username;
    }
  }

parseFeedBrief(obj: any): string {

    let brief: string;

    if (obj.item_type == "text") {

        brief = obj.text;

    } else if (obj.item_type == "link") {

        brief = "🔗 Link";

    } else if (obj.item_type == "like") {

        brief = "❤️ Like";

    } else if (obj.item_type == "media_share") {

        brief = "📷 Media Share";

    } else if (obj.item_type == "action_log") {

      brief = obj.action_log.description;

    } else {

        brief = "📷 Media";
    }

    return brief;
}

parseThreadItem(obj: any): string {

  let brief: any;

  if (obj.item_type == "text") {

      brief = obj.text;

  } else if (obj.item_type == "link") {

      brief = {

          text: obj.link.text,
          link_context: obj.link.link_context

      };

  } else if (obj.item_type == "like") {

      brief = "❤️ Like";

  } else if (obj.item_type == "media_share") {

      brief = {

         caption: obj.media_share.caption.text,
         url: obj.media_share.image_versions2.candidates[1].url
      };

  } else if (obj.item_type == "action_log") {

    brief = "@"+obj.action_log.description;

  } else if (obj.item_type == "media") {

    brief = obj.media.image_versions2.candidates[0].url;

  } else {

      brief = "📷 Media";
  }

  return brief;
}

resetAutoRunningTimer(): void{

  let intTimer = parseInt(this.vars.tempThread.threadTimer);
  if(intTimer > 0 && intTimer < 20){

    this.setTimer(this.vars.autoTimerDefaultValue);
  }
}

sendLike(): void{
  
  console.log(this.likeThreadURI);
  this.showSendingLoader = true;
  this.http.get(this.likeThreadURI).subscribe(res => {
    console.log(res);
  }, err => {

    //this.showSendingLoader = false;
  }, () => {

    //this.showSendingLoader = false;
  });
  console.log("newtest",this.vars.tempThread);
  this.resetAutoRunningTimer();
}


//not used for now
sendPhrase(phrase: string): void{
  
  let url = this.messageURI + phrase;
  console.log(url);
  this.showSendingLoader = true;
  this.http.get(url).subscribe(res => {
    console.log(res);
  }, err => {

    //this.showSendingLoader = false;
  }, () => {

    //this.showSendingLoader = false;
  });
  this.resetAutoRunningTimer();
}

sendText(): void{
  
  if(this.msgData.text){

    let url = this.messageURI + this.msgData.text;
    console.log(url);
    this.showSendingLoader = true;
    this.resetMsgData();
    this.http.get(url).subscribe(res => {
    console.log(res);
    }, err => {

      //this.showSendingLoader = false;
    }, () => {

      //this.showSendingLoader = false;
    });
    this.resetAutoRunningTimer();
  }
}

declareSeen(): void{

  console.log(this.seenURI);
  this.http.get(this.seenURI).subscribe(res => {
    console.log(res);
  });
}

}
