import { Component, OnInit } from '@angular/core';

import {UserService} from '../user.service';
import {UserModel,SecurityQuestions} from '../login/user-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['../CSS/light.css']
})
export class UserRegistrationComponent implements OnInit {
  userId:number=0;
  userName:string='';
  email:string='';
  userType:number=0;
  password:string='';
  confirmPassword:string='';
  listSecurityQues:Array<SecurityQuestions>=new Array<SecurityQuestions>();
  securityQues:number=0;
  securityAns:string='';
  
  showUserTypeMsg:boolean=false;
  showEmailMsg:boolean=false;
  showPwdMsg:boolean=false;
  showPwdNotMatchMsg:boolean=false;
  showSecQuesMsg:boolean=false;
  showSecAnsMsg:boolean=false;

  user:UserModel=new UserModel();
  constructor(private userservice:UserService,private router:Router) { }

  ngOnInit(): void {
    this.GetSecurityQuestions();
  }
  UserRegister=async()=>{
    if(this.email=="")
      this.showEmailMsg=true;
    else
      this.showEmailMsg=false;
    if(this.userType==0)
      this.showUserTypeMsg=true;
    else
      this.showUserTypeMsg=false;
    if(this.password=="")
      this.showPwdMsg=true;
    else
      this.showPwdMsg=false;
       
    if(this.password!=this.confirmPassword)
      this.showPwdNotMatchMsg=true;
    else
      this.showPwdNotMatchMsg=false;
    if(this.securityQues==0)
      this.showSecQuesMsg=true;
    else
      this.showSecQuesMsg=false;
    if(this.securityAns=="")
      this.showSecAnsMsg=true;
    else
      this.showSecAnsMsg=false;
    
    if(this.email!=""&&this.password!="" && this.confirmPassword==this.password && this.userType!=0 && this.securityQues!=0 && this.securityAns!=""){
    // this.user.userName=this.userName;
    this.user.email=this.email;
    this.user.userType=Number(this.userType);
    this.user.password=this.password;
    this.user.inputDate=new Date();
    this.user.securityQuesId=Number(this.securityQues);
    this.user.securityQuesAns=this.securityAns;
    const promise=await this.userservice.CheckEmailAvialable(this.email).toPromise().then(res => { // Success
    
     var result=res;
     if(result==true){
     alert('Email already registered.')
    }
    else
    {
      const promise1=this.userservice.UserRegistration(this.user).toPromise().then(res => { // Success
      
        this.user=res;
        alert('User registration successfully.');
        this.router.navigateByUrl('/login');
             
      } )
      .catch(res=>
        {alert('Error occured during User Registration.\n Error: '+JSON.stringify(res))});
    }
           
    } )
    .catch(res=>
      {alert('Error occured during fetching Email Availability.\n Error: '+JSON.stringify(res))});
     
    
    }

  }
 
  GetSecurityQuestions=async()=>{
    
    const promise=await this.userservice.scurityQuestions().toPromise().then(res => { // Success
    
     this.listSecurityQues=res;
    
                
    } )
    .catch(res=>
      {alert('Error occured during fetching Security Questions.\n Error: '+JSON.stringify(res))});
     
  }
 

}
