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
  
  constructor(private userservice:UserService,private router:Router) { }

  ngOnInit(): void {
  }
  
   UserLogin(userid:string,pwd:string){
    
    this.userservice.loginCheck(userid,pwd).subscribe(data=>
      {
        this.user=data;
      }
    );
    // setTimeout(this.userservice.loginCheck, 100)
        this.userservice.setUser(this.user);
    if(this.user.userId>0)
    {this.router.navigateByUrl('/dashboard');}
    else
    {window.alert('Invalid User');
    
  }
    
    
  }

}
