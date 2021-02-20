import { Component, OnInit } from '@angular/core';

import {UserService} from '../user.service';
import {UserModel,SecurityQuestions} from '../login/user-model';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['../CSS/light.css']
})
export class UserUpdateComponent implements OnInit {

  userId:number=0;
  userName:string='';
  email:string='';
  phoneNo?:number;
  userType:string='';

  listSecurityQues:Array<SecurityQuestions>=new Array<SecurityQuestions>();
  securityQues:number=0;
  securityAns:string='';
  // userNameAvailable:boolean=false;
  // userNameNotAvailable:boolean=false;
  user:UserModel=new UserModel();
  constructor(private userservice:UserService) { }

  ngOnInit(): void {
    this.user=this.userservice.getUser();
    this.GetSecurityQuestions();
    this.userId=this.user.userId;
    this.email=this.user.email;
    this.phoneNo=this.user.phoneNo;
    if(this.user.userType==1)
    this.userType='Admin';
    else if(this.user.userType==2)
    this.userType='Student';
    else
    this.userType='Business';
   ;
    this.securityQues=this.user.securityQuesId;
    this.securityAns=this.user.securityQuesAns;
    
  }
  GetSecurityQuestions=async()=>{
    
    const promise=await this.userservice.scurityQuestions().toPromise().then(res => { // Success
    
     this.listSecurityQues=res;
    
                
    } )
    .catch(res=>
      {alert('Error occured during fetching Security Questions.\n Error: '+JSON.stringify(res))});
     
  }

  UpdateUser=async()=>{
    if(this.email=="")
    alert('Please enter Email Id.');
         
   
    else if(this.securityQues==0)
    alert('Please Select Security Question.');
    else if(this.securityAns=="")
    alert('Please Enter Security Answer.');
    else if(this.email!="" ){
    // this.user.userName=this.userName;
    this.user.userId=this.userId;
    this.user.email=this.email;
    this.user.phoneNo=Number(this.phoneNo);
    this.user.updateDate=new Date();
    this.user.securityQuesId=Number(this.securityQues);
    this.user.securityQuesAns=this.securityAns;
    const promise=await this.userservice.UserRegistration(this.user).toPromise().then(res => { // Success
      
      this.user=res;
      alert('User Detail updated successfully.');
                
    } )
    .catch(res=>
      {alert('Error occured during User detail update.\n Error: '+JSON.stringify(res))});
    }
  }

}
