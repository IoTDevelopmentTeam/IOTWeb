import { Component, OnInit } from '@angular/core';

import {UserService} from '../user.service';
import {UserModel,SecurityQuestions} from '../login/user-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['../CSS/light.css']
})
export class UserUpdateComponent implements OnInit {

  userId:number=0;
  userName:string='';
  email:string='';
  phoneNo?:string;
  userType:string='';

  listSecurityQues:Array<SecurityQuestions>=new Array<SecurityQuestions>();
  securityQues:number=0;
  securityAns:string='';

  user:UserModel=new UserModel();
  showEmailMsg:boolean=false;
  showSecQuesMsg:boolean=false;
  showSecAnsMsg:boolean=false;
  showPhoneMsg:boolean=false;
  isPhNoValid:boolean=true;
  phoneLength:number=0;
  constructor(private userservice:UserService) { }

  ngOnInit(): void {
    const userstring=sessionStorage.getItem('loggedinuser');
    if(userstring!=null)
    { const loggedinuser = JSON.parse(userstring);
        
    this.user=loggedinuser;
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
   
    this.securityQues=this.user.securityQuesId;
    this.securityAns=this.user.securityQuesAns;
    }
    
  }
  GetSecurityQuestions=async()=>{
    
    const promise=await this.userservice.scurityQuestions().toPromise().then(res => { // Success
    
     this.listSecurityQues=res;
    
                
    } )
    .catch(res=>
      {
        Swal.fire('Error!', 'Error occured during fetching Security Questions.\n Error: '+JSON.stringify(res), 'error');
      });
     
  }

  UpdateUser=async()=>{
    if(this.email=="")
      this.showEmailMsg=true;
    else
      this.showEmailMsg=false;
    
    if(this.securityQues==0)
      this.showSecQuesMsg=true;
    else
      this.showSecQuesMsg=false;

    if(this.securityAns=="")
      this.showSecAnsMsg=true;
    else
      this.showSecAnsMsg=false;

    if(this.phoneNo!="")
    {
     
        var phone=Number(this.phoneNo);
        
        if(!isNaN(phone)){
        this.isPhNoValid=true;
        this.showPhoneMsg=false;
        if(this.phoneNo?.length!=10)
        {
          this.isPhNoValid=false;
          this.showPhoneMsg=true;
        }
        
        }
        else{      
        this.isPhNoValid=false;
        this.showPhoneMsg=true;
        }

       
      
    }

    if(this.email!="" && this.securityQues!=0 && this.securityAns!=""&& this.isPhNoValid){
    var emailExist=false;
    if(this.user.email!=this.email){
    const promise=await this.userservice.CheckEmailAvialable(this.email).toPromise().then(res => { // Success
    
      var result=res;
      if(result==true){
        emailExist=true;
        Swal.fire('Information!', 'Email already registered.', 'info');
      
     }
    })
    .catch(res=>
      {
        Swal.fire('Error!', 'Error occured during Email checking.\n Error: '+JSON.stringify(res), 'error');
      });
    }
    
    if(emailExist==false){
    this.user.userId=this.userId;
    this.user.email=this.email;
    this.user.phoneNo=this.phoneNo;
    this.user.updateDate=new Date();
    this.user.securityQuesId=Number(this.securityQues);
    this.user.securityQuesAns=this.securityAns;
    const promise1=await this.userservice.UserRegistration(this.user).toPromise().then(res => { // Success
      
      sessionStorage.setItem('loggedinuser',JSON.stringify(this.user));
      this.user=res;
      Swal.fire('Success!', 'User Detail updated successfully.', 'success');
                     
    } )
    .catch(res=>
      {
        Swal.fire('Error!', 'Error occured during User detail update.\n Error: '+JSON.stringify(res), 'error');
      });
    }
  }
  }

}
