import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { VarsService } from './../services/vars';
import { UtilService } from './../services/util';
import { Http } from '@angular/http';

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
    public loading;
    public profilePicture: string = "/assets/imgs/default_dp.png";
    public searchQuery: string = "";
    public activeSortLabel: string = "";

    constructor(
        public navCtrl: NavController,
        public vars: VarsService,
        public afDatabase: AngularFireDatabase,
        public http: Http,
        public util: UtilService,
        public loadingCtrl: LoadingController
    ) {

        //console.log(vars.retrieveData());
        if (!vars.getIsUserLoggedin()) {

            this.navCtrl.popToRoot();
        }

        this.userIgInfoURI = "/igInfo/" + this.vars.getUserLoginInfo().id;
        //console.log(this.userIgInfoURI);
        this.getThreads();
    }

    presentLoadingDefault() {
        this.loading = this.loadingCtrl.create({
            content: 'Loading threads...'
        });

        this.loading.present();
    }

    ionViewDidLoad() {
        //console.log('ionViewDidLoad homePage');
    }

    loadMore() {
        console.log('load more');
        this.http.get(this.vars.getLoadMoreEndpoint()).subscribe(res => {
            console.log(res);
        })
    }

    parseDateObj(tStamp: any) {

        //var tStamp = parseInt(tStamp)*1000;
        var newDateObject = new Date(parseInt(tStamp) / 1000);
        //EEEE, MMMM dd MMM yyyy @HH:mm:ss
        return newDateObject;
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

        } else {

            brief = "📷 Media";
        }

        return brief;

    }

    checkIfThreadIsTimed(threadID: any): any {

        for (let i = 0; i < this.vars.userTimers.length; i++) {

            if (threadID == this.vars.userTimers[i].id) {

                let now = Date.now();
                let timeLeftInSec = (((this.vars.userTimers[i].duration + this.vars.userTimers[i].timeSet) - now) / (1000 * 60)).toFixed();

                return timeLeftInSec;
            }
        }
        return null;
    }

    checkIfThreadIsLabeled(threadID: any): any {

        for (let i = 0; i < this.vars.labeledThreads.length; i++) {

            if (threadID == this.vars.labeledThreads[i].id) {

                return this.vars.labeledThreads[i].label;
            }
        }
        return "labelClear";
    }

    parseThreads(threads: any[]): any[] {

        let tempArray: any[] = []
        for (let i = 0; i < threads.length; i++) {

            let threadLabel = this.checkIfThreadIsLabeled(threads[i].thread_id);
            let threadTimer = this.checkIfThreadIsTimed(threads[i].thread_id);
            let autoTimerVal: boolean;
            if (threadTimer == null || threadTimer < 1) {

                autoTimerVal = true;
            } else {

                autoTimerVal = false;
            }
            tempArray.push(Object.assign({}, threads[i], { visibleBasedOnSearch: true, labelColor: threadLabel, threadTimer: threadTimer, timerHandle: null,  autoTimer: autoTimerVal, loadedData: false }));
        }
        return tempArray;
    }

    getThreads() {

        this.igDbObservable = this.afDatabase.object(this.userIgInfoURI).valueChanges();
        this.presentLoadingDefault();
        this.subscriptionHandle = this.igDbObservable.subscribe((data: any) => {

            //console.log(data);
            //this.subscriptionHandle.unsubscribe();
            this.vars.setUserIgInfo(data.user);
            this.profilePicture = data.user.profile_pic_url;
            this.vars.labeledThreads = this.util.objToArray(data.labels ? data.labels : []);
            this.vars.userTimers = this.util.objToArray(data.timers ? data.timers : []);
            this.vars.threads = this.parseThreads(data.threads);
            console.log(this.vars.threads);
            if (data.phrases) {

                //console.log(this.util.objToArray(data.phrases));
                this.vars.setUserPhrases(this.util.objToArray(data.phrases));
            }
            this.util.setCountDown();
            this.util.setNotificationAlert();
            this.loading.dismiss();
        });
    }

    searchFeed(): void {

        //console.log(this.searchQuery);
        if (this.searchQuery) {

            let searchRegx = new RegExp(this.searchQuery, "i");
            let resultCounter = 0;
            for (let i = 0; i < this.vars.threads.length; i++) {

                if ((this.vars.threads[i].users[0].full_name.search(searchRegx) >= 0) ||
                    (this.vars.threads[i].users[0].username.search(searchRegx) >= 0)) {

                    this.vars.threads[i].visibleBasedOnSearch = true;
                    resultCounter++;
                } else {

                    this.vars.threads[i].visibleBasedOnSearch = false;
                }

            }

            //this.feedListLength = resultCounter;
        } else {

            for (let i = 0; i < this.vars.threads.length; i++) {

                this.vars.threads[i].visibleBasedOnSearch = true;

            }
            //this.feedListLength = this.feedList.length;
        }

    }

    sortLable(labelColor: string): void {

        this.activeSortLabel = labelColor;
        let resultCounter = 0;
        for (let i = 0; i < this.vars.threads.length; i++) {

            if (this.vars.threads[i].labelColor == labelColor) {

                this.vars.threads[i].visibleBasedOnSearch = true;
                resultCounter++;
            } else {

                this.vars.threads[i].visibleBasedOnSearch = false;
            }

        }

    }

    sortTimer(): void {

        this.vars.threads.sort((a: any, b: any): number => {

            if (a.threadTimer == null && b.threadTimer == null) {

                return 0;
            } else {

                if (a.threadTimer == null) {

                    return 1;
                } else if (b.threadTimer == null) {

                    return -1;
                } else {

                    return a.threadTimer - b.threadTimer;
                }
            }
        });
    }

    refreshThreads(): void {

        for (let i = 0; i < this.vars.threads.length; i++) {

            this.vars.threads[i].visibleBasedOnSearch = true;
        }
        this.vars.threads.sort((a: any, b: any): number => {

            return b.items[0].timestamp - a.items[0].timestamp;
        });
        this.activeSortLabel = " ";
    }

    goToChats(index: number, thread: any) {

        this.vars.tempThreadKey = thread.thread_id;
        this.vars.tempThread = thread;
        //console.log(thread);
        this.navCtrl.push(ChatPage);
    }

}
