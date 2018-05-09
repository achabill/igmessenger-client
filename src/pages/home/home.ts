import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { VarsService } from './../services/vars';
import { UtilService } from './../services/util';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

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

    console.log(vars.retrieveData());
    if(!vars.getIsUserLoggedin()){

      this.navCtrl.popToRoot();
    }

    this.userIgInfoURI = "/igInfo/"+this.vars.getUserLoginInfo().id;
    //console.log(this.userIgInfoURI);
    this.getThreads();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad homePage');
  }

  getThreads() {
    
    this.igDbObservable = this.afDatabase.object(this.userIgInfoURI).valueChanges();
      this.subscriptionHandle = this.igDbObservable.subscribe((data) => {

        console.log(this.util.objToArray(data));
        //this.subscriptionHandle.unsubscribe();
      });
  }

}
