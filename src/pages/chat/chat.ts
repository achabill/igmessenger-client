import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { VarsService } from './../services/vars';
import { UtilService } from './../services/util';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  public igDbObservable: Observable<{}>;
  public subscriptionHandle: any;
  public loaderHandle: any;
  private userIgInfoURI: string;

  constructor(
    public navCtrl: NavController, 
    public vars: VarsService,
    public afDatabase: AngularFireDatabase,
    public util: UtilService
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad homePage');
  }


}
