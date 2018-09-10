

import { Injectable } from '@angular/core';
import firebase from 'firebase/app';

/*
  Generated class for the ChatRoomsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatRoomsProvider {

private chatRoomListRef:firebase.database.Reference;

  constructor() {
   firebase.auth().onAuthStateChanged(user=>{
     this.chatRoomListRef =firebase.database().ref(`/userProfile/chatrooms`);
     
   })
  }
createRooms(name:string):firebase.database.ThenableReference{
  return this.chatRoomListRef.push({
    chatroomName:name
  })
}
getChatRoomsList():firebase.database.Reference{
  return this.chatRoomListRef;
  
}
}