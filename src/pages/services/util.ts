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

        tempArray.push(Object.assign({}, obj[keysArray[i]], { id: keysArray[i]}));
    }
    return tempArray;
  }

}