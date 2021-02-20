import { Component, OnInit } from '@angular/core';

import { DeviceService } from '../device.service';
import { UserService } from '../user.service';
import { DeviceModel,DeviceDetail,UserDeviceModel,UserDeviceModelResult,PaneDetails,ConfigDetails } from './device-model';
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
  
  paneDetails:PaneDetails=new PaneDetails();
  configDetails:ConfigDetails=new ConfigDetails(0,0,'','');
  configs:ConfigDetails[]=[];
 
  device: DeviceModel=new DeviceModel(1,'Device 1','Device 1','Device 1',new Date(),1);
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
  deviceAddLabelName:string ='';
  deviceDetailLabelName:string='';
  deviceDetailId:number=0;
  attrNames:string[]=[];
  checkedAttrNames:string[]=[];

  showBarChart:Boolean=false;
  showLineChart:Boolean=false;
  showPieChart:Boolean=false;
  showGaugeChart:Boolean=false;
  showCurrentLocation:Boolean=false;

  alertValue:string='';
  lowValue:string='';
  mediumValue:string='';
  highValue:string='';
  
  userdevice:UserDeviceModel=new UserDeviceModel();
  result:UserDeviceModelResult=new UserDeviceModelResult();

LineChart:string='';
BarChart:string='';
PieChart:string='';
GaugeChart:string='';
Latitude:string='';
Longitude:string='';
DataTypeValue:string='';
GraphTypeValue:string='';
MapTypeValue:string='';

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
  openDeviceDetailPopup=async(device:DeviceModel)=>{
    
    this.checkedAttrNames=[];
    const promise=await this.deviceservice.getAttributeNames(device.deviceTagName).toPromise().then(data=>
      {
        this.attrNames=data;
        
      }
    )
    .catch(res=>
    {alert('Error occured during fetching Attributes.\n Error: '+JSON.stringify(res))}
    );
    this.showDetailDevice=true;
    this.deviceDetailLabelName=device.deviceName;
    this.deviceDetailId=device.deviceId;
    // this.detail.DeviceLabelName=device.DeviceId;
    
   
  }
  closeDeviceDetailPopup(){
    this.showDetailDevice=false;
  }
  AddDeviceSubmit=async()=>{
   
    //this.deviceAddId,this.deviceAddTagName,this.deviceAddUniqueIdentifier,new Date(),this.user.userId);
    

    this.userdevice.TagName=this.deviceAddTagName;
    this.userdevice.DeviceName=this.deviceAddLabelName;
    this.userdevice.UserId=this.user.userId;

     const promise=await this.deviceservice.addDevice(this.userdevice).toPromise().then(res => { 
      
        this.result=res;
        alert('Device mapped successfully.');
        this.closeAddDevicePopup();
        this.getAllUserById(this.user.userId);
      })
      .catch(res=>
        {alert('Error occured during device mapping.\n Error: '+JSON.stringify(res))
      });
       
    alert(this.result.Mmessage);
    
   
  }
  AddDeviceCancel(){
    this.closeAddDevicePopup();
  }
  DetailDeviceSubmit=async()=>{
   
    this.paneDetails.DeviceId=this.deviceDetailId;
    this.deviceservice.addPanelDetails
    const promise=await this.deviceservice.addPanelDetails(this.paneDetails).toPromise().then(data=>
      {
        var paneId=data;
        if(paneId>0)
        {
          var configDetail=[];
          configDetail= this.PrepareConfigData(paneId);
          const promise= this.deviceservice.addConfigDetails(configDetail).toPromise().then(data=>
            {})
            .catch(res=>
              {
                alert('Error occured during saving Config Detail.\n Error: '+JSON.stringify(res))}
              )
        }
        
      }
    )
    .catch(res=>
    {alert('Error occured during saving Pane Detail.\n Error: '+JSON.stringify(res))}
    );

    this.closeDeviceDetailPopup();
  }

  PrepareConfigData(paneid:number):any{
    this.configs=[];
    if(this.DataTypeValue=="LiveData")
    {
      alert(this.checkedAttrNames);
      if(this.checkedAttrNames.length!=0)
      {
        for(var i=0;i<this.checkedAttrNames.length;i++)
        {
          this.configs[i]=new ConfigDetails(1,paneid,'Attribute',this.checkedAttrNames[i]);
        }
      }
    }
    else if(this.DataTypeValue=="Graph"){
      if(this.GraphTypeValue=="LineChart")
      {
        this.configs[0]=new ConfigDetails(2,paneid,'X-axis','Time');
        this.configs[1]=new ConfigDetails(2,paneid,'Y-axis',this.LineChart);
      }
      else if(this.GraphTypeValue=="BarGraph")
      {

        this.configs[0]=new ConfigDetails(3,paneid,'X-axis','Time');
        this.configs[1]=new ConfigDetails(3,paneid,'Y-axis',this.BarChart);
      }
      else if(this.GraphTypeValue=="PieChart")
      {
        
        this.configs[0]=new ConfigDetails(4,paneid,'Attribute',this.PieChart);
    
      }
      else if(this.GraphTypeValue=="GaugeChart")
      {
        this.configs[0]=new ConfigDetails(5,paneid,'Attribute',this.GaugeChart);
        this.configs[1]=new ConfigDetails(5,paneid,'LowValue',this.lowValue);
        this.configs[2]=new ConfigDetails(5,paneid,'HighValue',this.highValue);
        this.configs[3]=new ConfigDetails(5,paneid,'MidValue',this.mediumValue);
        this.configs[4]=new ConfigDetails(5,paneid,'AlertValue',this.alertValue);
    
      }
    }
    else if(this.DataTypeValue=="Map"){
      if(this.MapTypeValue=="CurrentLocation")
      {
        this.configs[0]=new ConfigDetails(6,paneid,'Latitude',this.Latitude);
        this.configs[1]=new ConfigDetails(6,paneid,'Longitude',this.Longitude);
      }
      else if(this.MapTypeValue=="RouteMap")
      {
        this.configs[0]=new ConfigDetails(7,paneid,'ParameterName','ParameterValue');
      }
    }

  return this.configs;
  }
  LiveDataChange(e:any){
    
    if(e.target.checked==true)
    this.checkedAttrNames.push(e.target.name);
    else
    {
      const index = this.checkedAttrNames.indexOf(e.target.name, 0);
      if (index > -1) {
        this.checkedAttrNames.splice(index, 1);
      }
    }
   
  }
  DetailDeviceCancel(){
    this.closeDeviceDetailPopup();
  }
    
  onDataTypeSelected(selectedValue:string){
    this.allGraphShowFalse();
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
    { this.showParam=false;
      this.showMap=false;
      this.showGraph=false;
    this.allGraphShowFalse();  }
  }
  onMapTypeSelected(selectedValue:string){
    if(selectedValue=="CurrentLocation")
    {
      this.showCurrentLocation=true;
    }
    else
    this.showCurrentLocation=false;
  }

  onGraphTypeSelected(selectedValue:string){
    if(selectedValue=="LineChart")
    {
      this.showLineChart=true;
      this.showBarChart=false;
      this.showPieChart=false;
      this.showGaugeChart=false;
    }
    else if(selectedValue=="BarGraph")
    {
      this.showLineChart=false;
      this.showBarChart=true;
      this.showPieChart=false;
      this.showGaugeChart=false;
    }
    else if(selectedValue=="PieChart")
    {
      this.showLineChart=false;
      this.showBarChart=false;
      this.showPieChart=true;
      this.showGaugeChart=false;
    }
    else if(selectedValue=="GaugeChart")
    {
      this.showLineChart=false;
      this.showBarChart=false;
      this.showPieChart=false;
      this.showGaugeChart=true;
    }
    else
    {
      this.allGraphShowFalse();
    }
  }
  
 allGraphShowFalse()
 {
  this.showLineChart=false;
  this.showBarChart=false;
  this.showPieChart=false;
  this.showGaugeChart=false;
 }

}










  
  

