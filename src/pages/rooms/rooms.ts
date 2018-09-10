import { ProfilerProvider } from './../../providers/profiler/profiler';
import { HomePage } from './../home/home';
import { AuthProvider } from './../../providers/auth/auth';
import { ChatRoomsProvider } from './../../providers/chat-rooms/chat-rooms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Alert,AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-rooms',
  templateUrl: 'rooms.html',
})
export class RoomsPage {
 name:string;
 chatRoomList:Array<any>;

 userProfile:any;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private chatRoomsPro:ChatRoomsProvider,
     private alertCtrl:AlertController,private authPro:AuthProvider,private proProvide:ProfilerProvider) {

  }
 ionViewCanEnter(){
  this.chatRoomsPro.getChatRoomsList().off();
 }
 joinRoom(key){
   console.log(this.userProfile)

   this.navCtrl.setRoot(HomePage,{'key':key,'userProfile':this.userProfile});
   if (!this.userProfile.hasOwnProperty('firstName') || this.userProfile.hasOwnProperty('lastName')){
     console.log('does not contain firstName')
     let alert:Alert=this.alertCtrl.create({
       message:"Update profile before you enter chatroom",
       buttons:[{
         text:'cancel',
         role:'cancel',
       },{
         text:'update profile',
         handler:data=>{
           this.navCtrl.push('ProfilePage')
         }
       }]
     })
     alert.present();
   }else{
     this.navCtrl.setRoot(HomePage,{'key':key,'userProfile':this.userProfile});
   }

 }

  ionViewWillEnter(){
   
this.chatRoomsPro.getChatRoomsList().on('value',chatRoomsElistSnapShot=>{
  this.chatRoomList=[];

  chatRoomsElistSnapShot.forEach(snap=>{
    this.chatRoomList.push({
      id:snap.key,
      name:snap.val().chatroomName
    });
    return false;
  })
   })
this.proProvide.getUserProfile().on('value',userProfileSnapShot=>{
  this.userProfile=userProfileSnapShot.val();
  console.log("profile",this.userProfile)
})
   
  }
  

createRoom(){
  let alert:Alert=this.alertCtrl.create({
    message:"please enter chat room?",
    inputs: [
      {
        name: 'name',
        placeholder: 'room name'
    
      } ],
    buttons: [{
        text: 'Cancel',
       role:'cancel',
     
      },
      {
        text: 'create room',
        handler:data=>{
          console.log(data.name);
          this.chatRoomsPro.createRooms(data.name)
          .then(newchatRoom=>{
            console.log(newchatRoom);
        })
      }
      }],
    
    })
    alert.present();
  }
  logOut(){
    this.authPro.signOut().then(()=>{
      this.navCtrl.setRoot('LoginPage');
    })
  }
  gotoProfile(){
    this.navCtrl.push('ProfilePage');
  }
}
