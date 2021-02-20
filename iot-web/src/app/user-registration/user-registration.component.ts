import { Component, OnInit } from '@angular/core';

import {UserService} from '../user.service';
import {UserModel,SecurityQuestions} from '../login/user-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['../CSS/light.css','../CSS/bootstrap.min.css']
})
export class UserRegistrationComponent implements OnInit {
  userId:number=0;
  userName:string='';
  email:string='';
  phoneNo:number=0;
  userType:number=0;
  password:string='';
  confirmPassword:string='';
  listSecurityQues:Array<SecurityQuestions>=new Array<SecurityQuestions>();
  securityQues:number=0;
  securityAns:string='';
  // userNameAvailable:boolean=false;
  // userNameNotAvailable:boolean=false;
  user:UserModel=new UserModel();
  constructor(private userservice:UserService,private router:Router) { }

  ngOnInit(): void {
    this.GetSecurityQuestions();
  }
  UserRegister=async()=>{
    if(this.email=="")
    alert('Please enter Email Id.');
    else if(this.userType==0)
    alert('Please Select User Type.');
    else if(this.password=="")
    alert('Please choose Password.');
    
    else if(this.password!=this.confirmPassword)
    alert('Confirm password does not match with Password');
    else if(this.securityQues==0)
    alert('Please Select Security Question.');
    else if(this.securityAns=="")
    alert('Please Enter Security Answer.');
    else if(this.email!=""&&this.password!="" && this.confirmPassword==this.password){
    // this.user.userName=this.userName;
    this.user.email=this.email;
    this.user.phoneNo=Number(this.phoneNo);
    this.user.userType=Number(this.userType);
    this.user.password=this.password;
    this.user.inputDate=new Date();
    this.user.securityQuesId=Number(this.securityQues);
    this.user.securityQuesAns=this.securityAns;
    const promise=await this.userservice.UserRegistration(this.user).toPromise().then(res => { // Success
      
      this.user=res;
      alert('User registration successfully.');
      this.router.navigateByUrl('');
           
    } )
    .catch(res=>
      {alert('Error occured during User Registration.\n Error: '+JSON.stringify(res))});
    }

  }
 
  AvailabilityCheck=async()=>{
  //   if(this.userName!=""){
  //   const promise=await this.userservice.CheckUserNameAvialable(this.userName).toPromise().then(res => { // Success
    
  //    var result=res;
  //    if(result==true){
  //    this.userNameAvailable=true;
  //   this.userNameNotAvailable=false; 
  //   }
  //   else
  //   {
  //     this.userNameAvailable=false;
  //     this.userNameNotAvailable=true; 
  //   }
           
  //   } )
  //   .catch(res=>
  //     {alert('Error occured during fetching User Availability.\n Error: '+JSON.stringify(res))});
     
  // }
 }

 GetSecurityQuestions=async()=>{
    
    const promise=await this.userservice.scurityQuestions().toPromise().then(res => { // Success
    
     this.listSecurityQues=res;
    
                
    } )
    .catch(res=>
      {alert('Error occured during fetching Security Questions.\n Error: '+JSON.stringify(res))});
     
  }
 

}
