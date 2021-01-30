import { Component, OnInit,NgModule } from '@angular/core';

import { DeviceService } from '../device.service';
import { DeviceModel,DeviceDetail } from './device-model';
import {FormGroup,FormControl,FormBuilder,Validators} from '@angular/forms';


@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})

export class DeviceComponent implements OnInit {
   pageName='Device Page';
   title='Device-List';
   deviceTagName:string='';
   
   UserId:number=1;
   device: DeviceModel=new DeviceModel(1,'Device 1','Device 1','2021/01/01',1);
   //devices: Array<DeviceModel>=[];
   devices: Array<DeviceModel> = [new DeviceModel(1,'Device 1','Device 1','2021/01/01',1),new DeviceModel(2,'Device 2','Device 2','2021/01/01',1)];
   showDetailDevice:boolean=false;
   showAddDevice:boolean=false;
   showParam:boolean=false;
   showMap:boolean=false;
   showGraph:boolean=false;
   detail:DeviceDetail=new DeviceDetail();
   
     
  constructor(private deviceservice:DeviceService) { 
    this.devices=[];
    
  }

  ngOnInit() {
    // this.deviceForm = this.formBuilder.group({
    //   AddDeviveId: new FormControl('',Validators.required) ,
      
      
    // });
   this.detail=new DeviceDetail();
   this.getAllUserById(this.UserId); 
  }
  getAllUserById(UserId:number){
    this.deviceservice.getAllDeviceList(UserId).subscribe(data=>
      {
        this.devices=data;
      }
    );
    window.alert(this.devices.toString());
  }
  
  onSubmit(){
    window.alert('onSubmit');
  }
  openAddDevicePopup(){
     this.showAddDevice=true;
  }
  closeAddDevicePopup(){
    this.showAddDevice=false;
  }
  openDeviceDetailPopup(device:DeviceModel){
    window.alert( device.DeviceId);
    this.showDetailDevice=true;
    // this.detail.DeviceLabelName=device.DeviceId;
   
  }
  closeDeviceDetailPopup(){
    this.showDetailDevice=false;
  }
  AddDeviceSubmit(){
    window.alert(this.deviceTagName);
    // this.device.InputBy=this.UserId;
    // //this.device.deviceId=deviceid;
    // this.device.DeviceTagName=deviceTagName;
    // this.device.InputDate=new Date().toDateString();
    // this.deviceservice.addDevice(this.device);
    this.closeAddDevicePopup();
  }
  AddDeviceCancel(){
    this.closeAddDevicePopup();
  }
  DetailDeviceSubmit(){
    window.alert(this.detail.DeviceLabelName);
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
