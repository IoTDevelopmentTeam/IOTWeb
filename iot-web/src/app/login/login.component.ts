import { Component, OnInit } from '@angular/core';

import {UserModel} from './user-model';
import {UserService} from '../user.service'
import { Router } from '@angular/router';
import { DeviceComponent } from '../device/device.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user:UserModel=new UserModel();
  UserName:string='';
  Password:string='';
  constructor(private userservice:UserService,private router:Router) { }

  ngOnInit(): void {
  }
  
   UserLogin=async()=>{
    this.user.userName=this.UserName;
    this.user.password=this.Password;
  
    const promise=await this.userservice.loginCheck(this.user).toPromise().then(res => { // Success
      
      this.user=res;
      this.userservice.setUser(this.user);
      if(this.user.userId>0)
      {
        if(this.user.userType==1)
        this.router.navigateByUrl('/admindashboard');
        else
        this.router.navigateByUrl('/dashboard');
      }
      else
      {
        window.alert('Invalid User');
     
      }
      
    } )
    .catch(res=>
      {alert('Error occured during Login.\n Error: '+JSON.stringify(res))});
     

    // this.userservice.loginCheck(this.user).subscribe(data=>
    //   {
    //     this.user=data;
    //   }
    // );
    
        
    
    
  }

}
