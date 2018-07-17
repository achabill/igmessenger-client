import { Injectable } from "@angular/core";

@Injectable()
export class VarsService {

  private isUserLoggedin: boolean;
  private userLoginInfo: any;
  private userIgInfo: any;
  private userPhrases: any;

  public tempThreadKey: string = null;
  public tempThread: any;
  public labeledThreads: any[];
  public userTimers: any[];
  public threads: any[] = [];
  public notificationHandle: any;
  public autoTimerDefaultValue: number = 20 * 60 * 1000;
  public notificationTimerDefaultValue: number = 2 * 60 * 1000;
  //public serverHostAndPort: string = "http://45.77.225.86:1035";
  public serverHostAndPort: string = "http://127.0.0.1:1035";
  public serverUserEndPoint: string = "/user";
  public serverLikeThreadEndpoint: string = "/like";
  public serverMessageEndpoint: string = "/message";
  public serverSeenEndpoint: string = "/seen";
  public serverLoadMoreEndpoint: string = "/loadmore";

  constructor() {

    this.userPhrases = [];
  }

  retrieveData() {

    return "yes the thing worked";
  }

  setIsUserLoggedin(state: boolean): void {

    this.isUserLoggedin = state;
  }

  getIsUserLoggedin(): boolean {

    return this.isUserLoggedin;
  }

  setUserLoginInfo(info: any): void {

    this.setIsUserLoggedin(true);
    this.userLoginInfo = info;
  }

  getUserLoginInfo(): any {

    return this.userLoginInfo;
  }

  setUserIgInfo(info: any): void {

    this.setIsUserLoggedin(true);
    this.userIgInfo = info;
  }

  getUserIgInfo(): any {

    return this.userIgInfo;
  }

  setUserPhrases(phrase: any): void {

    this.setIsUserLoggedin(true);
    this.userPhrases = phrase;
  }

  getUserPhrases(): any {

    return this.userPhrases;
  }

  toggleAutoTimer(val: any): void {

    if(!(this.tempThread.threadTimer != null && this.tempThread.threadTimer > 0)){
      if (val != null) {

        this.tempThread.autoTimer = val;
      } else {

        this.tempThread.autoTimer = !this.tempThread.autoTimer;
      }
    }
  }

  getUserEndPoint(): string {

    return this.serverHostAndPort + this.serverUserEndPoint;
  }
  getLoadMoreEndpoint(): string {
    return this.serverHostAndPort + this.serverLoadMoreEndpoint;
  }
}
