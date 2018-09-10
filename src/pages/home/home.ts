import { ProfilerProvider } from './../../providers/profiler/profiler';
import { Component, ViewChild } from '@angular/core';
import { NavController, Content, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { RoomsPage } from '../rooms/rooms';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';

import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content:Content;
  message:string;
  userProfile;
  firstName:string;
  email:string;
  roomkey:string;
  offStatus:boolean=false;
  chatRef:firebase.database.Reference;
  firebaseRef:firebase.database.Reference;
  chats=[];
  data={
    type:'',
    message:''
  }
  joinData={};

  constructor(public navCtrl: NavController, private navParams: NavParams, private profileProvider:ProfilerProvider, private authPROV: AuthProvider) {
     this.roomkey=this.navParams.get('key') as string;
     this.userProfile=this.navParams.get('userProfile');
     this.chatRef=firebase.database().ref(`/userProfile/chatRooms/${this.roomkey}/chats`).push();
     this.data.type='message';
     let joinData={
       type:'join',
       user:this.userProfile.firstName,
       message:this.userProfile.firstName+' has joined this room',
       sentDate:Date()
     }
     this.chatRef.set(joinData);
     this.data.message='';
     firebase.database().ref(`/userProfile/chatRooms/${this.roomkey}/chats`).on('value',resp=>{
       this.chats=[];
       this.chats=snapShotToArray(resp);
       setTimeout(()=>{
         if(this.offStatus===false){
           this.content.scrollToBottom(300)
         }
       }),1000
     })
     console.log("chats array",this.chats)
   
  }
  ionViewCanEnter(){
    this.profileProvider.getUserProfile().off;
  }
  ionViewDidLoad() {
    this.profileProvider.getUserProfile().on('value',userprofileSnapShot=>{
      this.userProfile=userprofileSnapShot.val();
      this.firstName=userprofileSnapShot.val().firstName;
      this.email=userprofileSnapShot.val().email;
    })
  }
 

  logout(){
    this.authPROV.signOut().then(()=>{
       this.navCtrl.push(LoginPage);
    });
    
  }
  gotoRooms(){
     this.navCtrl.push("RoomsPage");  
  }
  profile(){
    this.navCtrl.push(ProfilePage);
  }
  exitChat(){
      let exitData=firebase.database().ref(`/userProfile/chatRooms/${this.roomkey}/chats`).push().set({
        type:'exit',
        user:this.userProfile.email,
        sentDate:Date(),
        message:this.userProfile.email+' has exited the room'
      });
      this.logout();
  }
  getChats(){
    return this.chats
  }
  sendMessage(){
    firebase.database().ref(`/userProfile/chatRooms/${this.roomkey}/chats`).push().set({
      type:this.data.type,
      user:this.userProfile.email,
      message:this.data.message,
      sentDate:Date()
    });
    this.message='';
  }
}
export const snapShotToArray=shapShot=>{
  let returnArr=[];
  shapShot.forEach(childSnapshot=>{
    let item=childSnapshot.val();
    returnArr.push(item);
  });
  console.log('array',returnArr)
  return returnArr;
}
