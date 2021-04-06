import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service'
import Swal from 'sweetalert2';
import {UserModel,ResetPassword} from '../login/user-model'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  userEmail:string='';
  password:string='';
  confirmpassword:string='';
  showPasswordMsg:boolean=false;
  showConfirmPasswordMsg:boolean=false;
  resetpassword:ResetPassword=new ResetPassword();
  user:UserModel=new UserModel();

  constructor(private userservice:UserService) { }

  ngOnInit(): void {
    const userstring=sessionStorage.getItem('loggedinuser');
    if(userstring!=null)
    { const loggedinuser = JSON.parse(userstring);
      this.user=loggedinuser;
      this.userEmail=this.user.email;
    }
  }

  ChangePassword=async()=>{
    if(this.password=="")
      this.showPasswordMsg=true;
    else
      this.showPasswordMsg=false;
    if(this.confirmpassword=="")
      this.showConfirmPasswordMsg=true;
    else
      this.showConfirmPasswordMsg=false;
    if(this.password!=""&& this.confirmpassword!="" && this.password!=this.confirmpassword)
      Swal.fire('Error!', 'Password does not match', 'error');

    if(this.password!="" && this.password==this.confirmpassword)
     {
       this.resetpassword.email=this.userEmail;
       this.resetpassword.password=this.password;
      
      const promise=await this.userservice.ResetPassword(this.resetpassword).toPromise().then(res => { // Success
         
      Swal.fire('Success!', 'Password changed succussfully.', 'success');
      
    } )
    .catch(res=>
      {
        Swal.fire('Error!', 'Error occured during changing password.\n Error: '+JSON.stringify(res), 'error');
        
      });
     
   
      }  

    }

}
