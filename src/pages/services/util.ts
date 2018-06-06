import {Injectable} from "@angular/core";
import { VarsService } from './../services/vars';

@Injectable()
export class UtilService {
  constructor(public vars: VarsService) {
    
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
   
    setInterval(()=>{ 

      for(let i = 0; i < this.vars.threads.length; i++){

        if(this.vars.threads[i].threadTimer != null && this.vars.threads[i].threadTimer > 0){

          this.vars.threads[i].threadTimer -= 1;
        }else{

          this.vars.threads[i].autoTimer = true;
        }
      }
    }, 60000);
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