import { ProfilerProvider } from './../../providers/profiler/profiler';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,Alert } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userProfile:any;
  birthDate:string;
  constructor(public navCtrl: NavController,private proProvider:ProfilerProvider,private alertCtrl:AlertController) {
  }
  ionViewCanEnter(){
   this.proProvider.getUserProfile().off();
  }

  ionViewDidLoad() {
   this.proProvider.getUserProfile().on('value',userProfileSnapShot=>{
     this.userProfile=userProfileSnapShot.val();
     this.birthDate=userProfileSnapShot.val().birthDate
   })
    
  }
  updateDOB(birthDate){
this.proProvider.updatDOB(birthDate);
}
updateName(){
  const alert:Alert=this.alertCtrl.create({
    message:'Your first name and last name',
    inputs:[{
      name:'firstName',
      placeholder:'Enter first name',
      value:this.userProfile.firstName
    },{
      name:'secondName',
      placeholder:'Enter your second name',
      value:this.userProfile.secondName
    }],
    buttons:[{
      text:'cancel',
    },{
      text:'Save',
      handler:data=>{
        this.proProvider.updateName(data.firstName,data.secondName)
      }
    }]
  })
  alert.present();
}
updatePassword(){

  const alert:Alert=this.alertCtrl.create({
    inputs:[{
      name:'oldPassword',
      placeholder:'Enter old password',
      type:'password'
    },{
      name:'newPassword',
      placeholder:'Enter new password',
      type:'password'
    }],
    buttons:[{
      text:'cancel',
    },{
      text:'Save',
      handler:data=>{
        this.proProvider.updatePassword(data.newPassword,data.oldPassword)
        .catch(err=>{
          console.log('Error message from catch',err.message)
          let newAlert:Alert =this.alertCtrl.create({
            message:err.message
          })
          newAlert.present();
        })
      }
    }]
   
  })
  alert.present();
}

}
