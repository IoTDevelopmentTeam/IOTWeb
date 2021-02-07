import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';
import { AdminService } from '../admin.service';
import { DeviceAddModel} from '../device/device-model';
import { UserModel } from '../login/user-model';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  deviceadd:DeviceAddModel=new DeviceAddModel();
  user :UserModel;
  deviceAddUniqueIdentifier:string='';
  tagName:string='';
  constructor(private userservice:UserService,private adminservice:AdminService) { 
    this.user=new UserModel();
  }

  ngOnInit(): void {
    this.user=this.userservice.getUser();
    var UserId=this.user.userId;
  }

  generateTagName=async()=>{
    
    this.deviceadd.DeviceUniqueIdentifier=this.deviceAddUniqueIdentifier;
    this.deviceadd.InputBy=this.user.userId.toString();
    this.deviceadd.InputDate=new Date();

   
    const promise=await this.adminservice.addDevice(this.deviceadd).toPromise().then(res => { // Success
      alert('Device added successfully.');
      this.tagName=res;
      alert(this.tagName);
      
    } )
    .catch(res=>
      {alert('Error occured during adding device.\n Error: '+JSON.stringify(res))});
     
  }}
