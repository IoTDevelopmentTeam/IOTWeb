import { Component, OnInit } from '@angular/core';


import {UserService} from '../user.service'
import {UserSecurityQuestions,ResetPassword} from '../login/user-model'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
        Swal.fire('Error!', 'Email Id is not registered.', 'error');
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
        Swal.fire('Error!','Error occured during Security Question fetching.\n Error: '+JSON.stringify(res), 'error');
      });
     
   
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
            Swal.fire('Information','Security Answas is not correct. Please contact admin for Password Reset.','info');
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
        Swal.fire('Error!', 'Password does not match', 'error');

      if(this.userEmail!="" && this.password!="" && this.password==this.confirmPassword)
       {
         this.resetpassword.email=this.userEmail;
         this.resetpassword.password=this.password;
        
        const promise=await this.userservice.ResetPassword(this.resetpassword).toPromise().then(res => { // Success
           
        Swal.fire('Success!', 'Password reset succussfully.', 'success');
        this.router.navigateByUrl('');
      } )
      .catch(res=>
        {
          Swal.fire('Error!', 'Error occured during Resetting Password.\n Error: '+JSON.stringify(res), 'error');
          
        });
       
     
        }  
  
      }
  }
