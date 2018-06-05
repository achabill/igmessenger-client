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
        }
      }
    }, 60000);
  }

}