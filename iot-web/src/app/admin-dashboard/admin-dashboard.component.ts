import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';
import { AdminService } from '../admin.service';
import { DeviceAdminModel,DeviceAddModel} from '../device/device-model';
import { UserModel } from '../login/user-model';
import {DeviceModel} from '../device/device-model';
import { Router } from '@angular/router';

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
  devices: Array<DeviceAdminModel>=[];
  updateDevice:DeviceAdminModel=new DeviceAdminModel();
  constructor(private userservice:UserService,private adminservice:AdminService,private router:Router) { 
    this.user=new UserModel();
  }

  ngOnInit(): void {

    const userstring=sessionStorage.getItem('loggedinuser');
    if(userstring!=null)
    { const loggedinuser = JSON.parse(userstring);
            
      this.user=this.userservice.getUser();
      var UserId=this.user.userId;
      this.getAllDevices();
    }
    else
    this.router.navigateByUrl('/login');
    
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

  IsUsedChange=async(e:any)=>{

    
    if(e.target.checked==true)
    this.updateDevice.isUsed=true;
    else
    this.updateDevice.isUsed=false;
    this.updateDevice.deviceTagName=e.target.name;

         
    const promise=await this.adminservice.UpdateDevice(this.updateDevice).toPromise().then(res => { // Success
      this.getAllDevices();
      
    } )
    .catch(res=>
      {alert('Error occured during updating device.\n Error: '+JSON.stringify(res))
      this.getAllDevices();
    });
     
  }
  
  

}
