import { Component, OnInit } from '@angular/core';


import {UserService} from '../user.service'
import {UserSecurityQuestions,ResetPassword} from '../login/user-model'
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../CSS/light.css']
})
export class ForgotPasswordComponent implements OnInit {
  showResetPwd:boolean=false;
  showDivSecQues:boolean=false;
  showDivEmail:boolean=true;

  userEmail:string='';
  secAns:string='';
  password:string='';
  confirmPassword:string='';
  userSecQuestion:UserSecurityQuestions=new UserSecurityQuestions();
  resetpassword:ResetPassword=new ResetPassword();

  showEmailMsg:boolean=false;
  showSecAnsMsg:boolean=false;
  showPwdMsg:boolean=false;
  showConfirmPwdMsg:boolean=false;

 
  constructor(private userservice:UserService,private router:Router) { }

  ngOnInit(): void {
  }

  FetchUserSecQues=async()=>{
    if(this.userEmail=="")
      this.showEmailMsg=true;
    else
      this.showEmailMsg=false;

    if(this.userEmail!="")
     {
    
      const promise=await this.userservice.userSecurityQuestions(this.userEmail).toPromise().then(res => { // Success
         
      if(res.securityQuesId==0)
      { 
        window.alert('Email Id is not registered.');
      }
      else {
        this.userSecQuestion=res;
        this.showResetPwd=false;
        this.showDivSecQues=true;
        this.showDivEmail=false;
      
      }
      
    } )
    .catch(res=>
      {
        alert('Error occured during Security Question fetching.\n Error: '+JSON.stringify(res))});
     
   
      }  

    }

    CheckSecurityAns(){
      if(this.secAns=="")
        this.showSecAnsMsg=true;
      else
        {
          this.showSecAnsMsg=false;

          if( this.secAns==this.userSecQuestion.securityQuesAns)
          {
            this.showResetPwd=true;
            this.showDivSecQues=false;
            this.showDivEmail=false;
          }
          else
          {
            alert('Security Answas is not correct. Please contact admin for Password Reset.');
          }
        }
  }

    
    ResetPassword=async()=>{
      if(this.password=="")
        this.showPwdMsg=true;
      else
        this.showPwdMsg=false;
      if(this.confirmPassword=="")
        this.showConfirmPwdMsg=true;
      else
        this.showConfirmPwdMsg=false;
      if(this.password!=""&& this.confirmPassword!="" && this.password!=this.confirmPassword)
        alert('Password does not match');

      if(this.userEmail!="" && this.password!="" && this.password==this.confirmPassword)
       {
         this.resetpassword.email=this.userEmail;
         this.resetpassword.password=this.password;
        
        const promise=await this.userservice.ResetPassword(this.resetpassword).toPromise().then(res => { // Success
           
        
        alert('Password reset succussfully.');
        this.router.navigateByUrl('');
      } )
      .catch(res=>
        {
          alert('Error occured during Resetting Password.\n Error: '+JSON.stringify(res))});
       
     
        }  
  
      }
  }
