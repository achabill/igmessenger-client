import {Injectable} from "@angular/core";
import { VarsService } from './../services/vars';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { promises } from "fs";

@Injectable()
export class UtilService {
  constructor(
    public vars: VarsService,
    public localNotifications: LocalNotifications) {

  }

  retrieveData() {

    return "yes the thing worked";
  }

  objToArray(obj: any): any[] {

    let keysArray = Object.keys(obj);
    let tempArray = [];
    for(let i = 0; i < keysArray.length; i++){

        let temp: any = {};
        if(typeof obj[keysArray[i]] == "string"){

            let temp2: any = {};
            temp2[keysArray[i]] = obj[keysArray[i]];
            temp = Object.assign({}, temp2, { id: keysArray[i]});
        }else{

            temp = Object.assign({}, obj[keysArray[i]], { id: keysArray[i]});
        }
        tempArray.push(temp);
    }
    return tempArray;
  }

  setCountDown(): void {

    for(let i = 0; i < this.vars.threads.length; i++){

      this.setTimerInterval(this.vars.threads[i]);
    }
  }

  setTimerInterval(thread: any): void {

   thread.timerHandle = setInterval(()=>{

     if(thread.threadTimer != null && thread.threadTimer > 0){

       thread.threadTimer -= 1;
     }

   }, 60000);
  }

  setNotificationAlert(): void {

    this.localNotifications.hasPermission().then((permission)=>{

      alert(permission);
      if(permission){

        this.setNotification();
      }else{

        this.localNotifications.requestPermission().then((requestedPermission)=>{

          if(requestedPermission){

            this.setNotification();
          }else{

            alert("You need to grant us permission to be able to receive notification.");
            console.log("You need to grant us permission to be able to receive notification.");
          }
        }).catch((e)=>{

          console.log("1");
        });
      }
    }).catch((e)=>{

      console.log("2");
    }); 
  }

  setNotification(): void {

    this.vars.notificationHandle = setInterval(()=>{

      this.localNotifications.schedule({
        id: 1,
        title: "My test app",
        text: 'Single ILocalNotification from travis',
        badge: 7,
        vibrate: true,
        priority: 2,
        launch: true,
        lockscreen: true,
        data: { secret: "hello there... ho" }
      });
    }, this.vars.notificationTimerDefaultValue);
  }

  formatTimer(mins: number) {

    if(mins > 0 && mins < 60) {

      return mins+"mins";
    }else if(mins >= 60 && mins < 1440){

      return (mins/60).toFixed(1)+"hrs";
    }else if(mins >= 1440 && mins < 43200){

      return (mins/1440).toFixed(1)+"dys";
    }else{

        return mins+"mins"
    }
  }
}
