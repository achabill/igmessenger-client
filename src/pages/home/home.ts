import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { VarsService } from './../services/vars';
import { UtilService } from './../services/util';

import { ChatPage } from './../chat/chat';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private userIgInfoURI: string;

  public igDbObservable: Observable<{}>;
  public subscriptionHandle: any;
  public loaderHandle: any;
  public profilePicture: string = "/assets/imgs/default_dp.png";
  public threads: any[] = [];
  public searchQuery: string = "";

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
    console.log(this.userIgInfoURI);
    this.getThreads();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad homePage');
  }

  parseDateObj(tStamp: any){
        
    //var tStamp = parseInt(tStamp)*1000;
        var newDateObject = new Date(parseInt(tStamp)/1000);
    //EEEE, MMMM dd MMM yyyy @HH:mm:ss
        return newDateObject;
    }

  parseFeedBrief(obj: any): string {
        
    let brief: string;

    if(obj.item_type == "text"){

        brief = obj.text;

    }else if(obj.item_type == "link"){
        
        brief = "🔗 Link";

    }else if(obj.item_type == "like"){
        
        brief = "❤️ Like";

    }else if(obj.item_type == "media_share"){
        
        brief = "📷 Media Share";

    }else{

        brief = "📷 Media";
    }

    return brief;

}

  parseThreads(threads: any[]): any[]{

    let tempArray: any[] = []
    for(let i = 0; i < threads.length; i++){

      tempArray.push(Object.assign({}, threads[i], { visibleBasedOnSearch: true}));
    }
    return tempArray;
  }

  getThreads() {
    
    this.igDbObservable = this.afDatabase.object(this.userIgInfoURI).valueChanges();
      this.subscriptionHandle = this.igDbObservable.subscribe((data: any) => {

        console.log(data);
        //this.subscriptionHandle.unsubscribe();
        this.vars.setUserIgInfo(data.user);
        this.profilePicture = data.user.profile_pic_url;
        this.threads = this.parseThreads(data.threads);
        console.log(this.threads);
      });
  }

  searchFeed(): void{

    console.log(this.searchQuery);
    if(this.searchQuery){
        
        let searchRegx = new RegExp(this.searchQuery, "i");
        let resultCounter = 0;
        for(let i = 0; i < this.threads.length; i++){

            if((this.threads[i].users[0].full_name.search(searchRegx) >= 0) || 
            (this.threads[i].users[0].username.search(searchRegx) >= 0)){

                this.threads[i].visibleBasedOnSearch = true;
                resultCounter++;
            }else{

                this.threads[i].visibleBasedOnSearch = false;
            }

        }

        //this.feedListLength = resultCounter;
    }else{

        for(let i = 0; i < this.threads.length; i++){
            
            this.threads[i].visibleBasedOnSearch = true;
            
        }
        //this.feedListLength = this.feedList.length;
    }

 }

  goToChats(index: number, thread: any){

    this.navCtrl.push(ChatPage);
  }

}
