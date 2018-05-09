import {Injectable} from "@angular/core";

@Injectable()
export class VarsService {

  private isUserLoggedin: boolean;
  private userLoginInfo: any;
  
  constructor() {
    
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

}