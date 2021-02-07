import { Component, OnInit } from '@angular/core';

import {UserService} from '../user.service';
import {UserModel} from '../login/user-model';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  userId:number=0;
  userName:string='';
  email:string='';
  phoneNo:number=0;
  userType:number=0;
  password:string='';
  confirmPassword:string='';
  user:UserModel=new UserModel();
  constructor(private userservice:UserService) { }

  ngOnInit(): void {
  }
  UserRegister=async()=>{
    this.user.userName=this.userName;
    this.user.email=this.email;
    this.user.phoneNo=Number(this.phoneNo);
    this.user.userType=Number(this.userType);
    this.user.password=this.password;
    this.user.inputDate=new Date();
    const promise=await this.userservice.UserRegistration(this.user).toPromise().then(res => { // Success
      alert('User registration successfully.');
      this.user=res;
           
    } )
    .catch(res=>
      {alert('Error occured during User Registration.\n Error: '+JSON.stringify(res))});
     

  }
  AvailabilityCheck(){
    
  }

}
