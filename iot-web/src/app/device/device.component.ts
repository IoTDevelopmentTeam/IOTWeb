import { Component, OnInit } from '@angular/core';

import { DeviceService } from '../device.service';
import { UserService } from '../user.service';
import { DeviceModel,DeviceDetail,DeviceAddModel } from './device-model';
import {FormGroup,FormControl,FormBuilder,Validators} from '@angular/forms';
import { UserModel } from '../login/user-model';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  pageName='Device Page';
  title='Device-List';
  DeviceTagName:string='';
  
 
  device: DeviceModel=new DeviceModel(1,'Device 1','Device 1',new Date(),1);
  devices: Array<DeviceModel>=[];
  //devices: Array<DeviceModel> = [new DeviceModel(1,'Device 1','Device 1','2021/01/01',1),new DeviceModel(2,'Device 2','Device 2','2021/01/01',1)];
  showDetailDevice:boolean=false;
  showAddDevice:boolean=false;
  showParam:boolean=false;
  showMap:boolean=false;
  showGraph:boolean=false;
  detail:DeviceDetail=new DeviceDetail();
  user :UserModel;
  x:string ='';
  deviceAddId:number =0;
  deviceAddTagName:string ='';
  deviceAddUniqueIdentifier:string ='';
  deviceDetailTagName:string='';
  deviceadd:DeviceAddModel=new DeviceAddModel();

  constructor(private deviceservice:DeviceService,private userservice:UserService) { 
    this.devices=[];
    this.user=new UserModel();
  }

  ngOnInit(): void {
    this.detail=new DeviceDetail();
   this.user=this.userservice.getUser();
   var UserId=this.user.userId;
   this.getAllUserById(UserId); 
  }

  getValue()
  {
    alert(this.x);
  }

  getAllUserById(UserId:number){
    this.deviceservice.getAllDeviceList(UserId).subscribe(data=>
      {
        this.devices=data;
      }
    );
    
  }
  
  onSubmit(){
    // window.alert('onSubmit');
  }
  openAddDevicePopup(){
     this.showAddDevice=true;
  }
  closeAddDevicePopup(){
    this.showAddDevice=false;2021
  }
  openDeviceDetailPopup(device:DeviceModel){
    
    this.showDetailDevice=true;
    this.deviceDetailTagName=device.deviceTagName;
    // this.detail.DeviceLabelName=device.DeviceId;
   
  }
  closeDeviceDetailPopup(){
    this.showDetailDevice=false;
  }
  AddDeviceSubmit(){
    alert(this.deviceAddTagName);
    //this.deviceAddId,this.deviceAddTagName,this.deviceAddUniqueIdentifier,new Date(),this.user.userId);
    this.deviceadd.DeviceTagName=this.deviceAddTagName;
    this.deviceadd.DeviceUniqueIdentifier=this.deviceAddUniqueIdentifier;
    this.deviceadd.InputBy=this.user.userId;
    this.deviceadd.InputDate=new Date();
    var data=this.deviceservice.addDevice(this.deviceadd);
    this.closeAddDevicePopup();
    this.getAllUserById(this.user.userId);
  }
  AddDeviceCancel(){
    this.closeAddDevicePopup();
  }
  DetailDeviceSubmit(){
     this.closeDeviceDetailPopup();
  }
  DetailDeviceCancel(){
    this.closeDeviceDetailPopup();
  }
    
  onDataTypeSelected(selectedValue:string){
    if(selectedValue=="Graph")
    {
      this.showParam=false;
      this.showMap=false;
      this.showGraph=true;
    }
    else if(selectedValue=="Map")
    {
      this.showParam=false;
      this.showMap=true;
      this.showGraph=false;
    }
    else if(selectedValue=="LiveData")
    {
      this.showParam=true;
      this.showMap=false;
      this.showGraph=false;
    }
    else
    {this.showParam=false;
      this.showMap=false;
      this.showGraph=false;}
  }
  
  
 

}










  
  

