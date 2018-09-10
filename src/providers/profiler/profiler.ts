import  firebase, { User }  from 'firebase/app';
import 'firebase/database';

import { Injectable } from '@angular/core';

/*
  Generated class for the ProfilerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfilerProvider {

userProfile:firebase.database.Reference;
currentUser:User;

  constructor() {
    firebase.auth().onAuthStateChanged(user=>{
      if(user){
      this.currentUser =user;
      this.userProfile=firebase.database().ref(`userProfile/${user.uid}`)
      }
    })
    console.log('Hello ProfilerProvider Provider');
  }
getUserProfile():firebase.database.Reference{
  return this.userProfile
}
updateName(firstName:string,lastName:string):Promise<any>{
  return this.userProfile.update({firstName,lastName})

}
updatDOB(birthdate:string):Promise<any>{
  return this.userProfile.update({birthdate})  
}
updatePassword(newPassword:string,oldPassword:string):Promise<any>{
  const credentials:firebase.auth.AuthCredential=
  firebase.auth.EmailAuthProvider.credential(this.currentUser.email,oldPassword);
  return this.currentUser.reauthenticateWithCredential(credentials).then(user=>{
    this.currentUser.updatePassword(newPassword).then(user=>{
      console.log('Password has been changed')
    })
  }).catch(error=>{
    console.log(error);
  })
 
}

}
