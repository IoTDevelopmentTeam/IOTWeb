import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';
import { AdminService } from '../admin.service';
import { DeviceAdminModel,DeviceAddModel} from '../device/device-model';
import { UserModel } from '../login/user-model';
import {DeviceModel} from '../device/device-model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  displayName:string='';
  constructor(private userservice:UserService,private adminservice:AdminService,private router:Router) { 
    this.user=new UserModel();
  }

  ngOnInit(): void {

    const userstring=sessionStorage.getItem('loggedinuser');
    if(userstring!=null)
    { const loggedinuser = JSON.parse(userstring);
      this.user=loggedinuser;
      this.getAllDevices();
      this.displayName=this.user.email.substring(0,this.user.email.indexOf('@'));
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
      Swal.fire('Success!', 'Devices added successfully.', 'success');
      this.tagName=res;
      this.getAllDevices();
      
    } )
    .catch(res=>
      {Swal.fire('Error!', 'Error occured during adding device.\n Error: '+JSON.stringify(res), 'error');
      });
     
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
      {
        Swal.fire('Error!', 'Error occured during updating device.\n Error: '+JSON.stringify(res), 'error');
        this.getAllDevices();
      });
     
  }
  
  LogOut(){
    sessionStorage.removeItem('loggedinuser');
    sessionStorage.removeItem('userdevices');
    this.router.navigateByUrl('/login');
  }

}
