import { Component, OnInit } from '@angular/core';

import {UserModel} from './user-model';
import {UserService} from '../user.service'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../CSS/light.css']
})
export class LoginComponent implements OnInit {
  user:UserModel=new UserModel();
  Email:string='';
  Password:string='';
  showPwdMsg:boolean=false;
  showEmailMsg:boolean=false;
  constructor(private userservice:UserService,private router:Router) { }

  ngOnInit(): void {
  }
  
   UserLogin=async()=>{
    this.user.email=this.Email;
    this.user.password=this.Password;
    if(this.user.email=="")
      this.showEmailMsg=true;
    else
      this.showEmailMsg=false;
    if(this.user.password=="")
      this.showPwdMsg=true;
    else
      this.showPwdMsg=false;
    if(this.user.email!=""&& this.user.password!="")
    {
      const promise=await this.userservice.loginCheck(this.user).toPromise().then(res => { // Success
      if(res==null)
      { 
        Swal.fire('Error!', 'Invalid Email or Password.', 'error');
      }
      else {
      this.user=res;
      this.userservice.setUser(this.user);
      sessionStorage.setItem('loggedinuser',JSON.stringify(this.user));
      if(this.user.userId>0)
      {
        if(this.user.userType==1)
        this.router.navigateByUrl('/admindashboard');
        else
        this.router.navigateByUrl('/device/dashboard');
      }
      else
      {
        Swal.fire('Error!', 'Invalid User', 'error');
        
      }
    }
      
    })
    .catch(res=>
    {
      Swal.fire('Error!','Error occured during Login.\n Error: '+JSON.stringify(res), 'error');
    });
  }  
  }

}
