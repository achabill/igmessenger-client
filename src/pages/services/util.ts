import {Injectable} from "@angular/core";

@Injectable()
export class UtilService {
  constructor() {
    
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

}