import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';
import { AdminService } from '../admin.service';
import { DeviceAddModel} from '../device/device-model';
import { UserModel } from '../login/user-model';
import {DeviceModel} from '../device/device-model';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['../CSS/light.css']
})
export class AdminDashboardComponent implements OnInit {
  devicesadd:DeviceAddModel[]=[];
  device:DeviceAddModel=new DeviceAddModel();
  user :UserModel;
  deviceAddUniqueIdentifier:string='';
  tagName:string='';
  tagsNo:number=1;
  devices: Array<DeviceModel>=[];
  constructor(private userservice:UserService,private adminservice:AdminService) { 
    this.user=new UserModel();
  }

  ngOnInit(): void {
    this.user=this.userservice.getUser();
    var UserId=this.user.userId;
    this.getAllDevices();
  }

  getAllDevices(){
    this.adminservice.getAllDeviceList().subscribe(data=>
      {
        this.devices=data;
      }
    );
    
  }

  generateTagName=async()=>{
    
    var tagNo=Number(this.tagsNo);
    this.devicesadd=[];
    for(var i=0;i<tagNo;i++){
    
    this.device.InputBy=this.user.userId.toString();
    this.device.InputDate=new Date();
    this.devicesadd[i]=this.device;
    }
      
    const promise=await this.adminservice.addDevice(this.devicesadd).toPromise().then(res => { // Success
      alert('Devices added successfully.');
      this.tagName=res;
      alert(this.tagName);
      this.getAllDevices();
      
    } )
    .catch(res=>
      {alert('Error occured during adding device.\n Error: '+JSON.stringify(res))});
     
  }
  


}
