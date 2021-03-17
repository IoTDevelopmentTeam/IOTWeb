import { Component, OnInit,ViewChild } from '@angular/core';

import { DeviceService } from '../device.service';
import { UserService } from '../user.service';
import { DeviceModel,DeviceDetail,UserDeviceModel,UserDeviceModelResult,PaneDetails,ConfigDetails } from './device-model';
import {FormGroup,FormControl,FormBuilder,Validators} from '@angular/forms';
import { UserModel } from '../login/user-model';
import { Router , NavigationStart } from '@angular/router';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {

  DeviceTagName:string='';

  @ViewChild('AddDeviceClose') AddDeviceClose:any;
  @ViewChild('DetailDeviceClose') DetailDeviceClose:any;
  displayName:string='';
  paneDetails:PaneDetails=new PaneDetails();
  configDetails:ConfigDetails=new ConfigDetails(0,0,'','');
  configs:ConfigDetails[]=[];
 
  device: DeviceModel=new DeviceModel(1,'Device 1','Device 1','Device 1',new Date(),1);
  devices: Array<DeviceModel>=[];
  //devices: Array<DeviceModel> = [new DeviceModel(1,'Device 1','Device 1','2021/01/01',1),new DeviceModel(2,'Device 2','Device 2','2021/01/01',1)];
 
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
  resultmapdevice:UserDeviceModelResult=new UserDeviceModelResult();

LineChart:string='';
BarChart:string='';
PieChart:string='';
GaugeChart:string='';
Latitude:string='';
Longitude:string='';
DataTypeValue:string='';
GraphTypeValue:string='';
MapTypeValue:string='';
showSideBar:boolean=false;

showDeviceLabelNameMsg:boolean=false;
showDeviceTagNameMsg:boolean=false;
showDataTypeMsg:boolean=false;
showGraphTypeMsg:boolean=false;
showMapTypeMsg:boolean=false;
showParamMsg:boolean=false;
showLongitudeMsg:boolean=false;
showLatitudeMsg:boolean=false;
showHighValueMsg:boolean=false;
showLowValueMsg:boolean=false;
showMediumValueMsg:boolean=false;
showAlertValueMsg:boolean=false;
showBarChartMsg:boolean=false;
showLineChartMsg:boolean=false;
showPieChartMsg:boolean=false;
showGaugeChartMsg:boolean=false;
addPaneFlag:boolean=true;



  constructor(private deviceservice:DeviceService,private userservice:UserService,private router:Router) { 
    
    this.devices=[];
    this.user=new UserModel();

  }
  

  ngOnInit(): void {
    const userstring=sessionStorage.getItem('loggedinuser');
    if(userstring!=null)
    { const loggedinuser = JSON.parse(userstring);
            
      this.detail=new DeviceDetail();
      // this.user=this.userservice.getUser();
      this.user=loggedinuser;
      var UserId=this.user.userId;
      this.getAllUserById(UserId); 
      this.displayName=this.user.email.substring(0,this.user.email.indexOf('@'));
    }
    else
    this.router.navigateByUrl('/login');
  }

  funcShowSideBar()
  {
    if(this.showSideBar==false)
    this.showSideBar=true;
    else
    this.showSideBar=false;
  }
  LogOut(){
    sessionStorage.removeItem('loggedinuser');
    sessionStorage.removeItem('userdevices');
    this.router.navigateByUrl('/login');
  }
  

  getAllUserById(UserId:number){
    this.deviceservice.getAllDeviceList(UserId).subscribe(data=>
      {
        this.devices=data;
        sessionStorage.setItem('userdevices',JSON.stringify(this.devices));
      }
    );
    
  }
  
  onSubmit(){
    // window.alert('onSubmit');
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
    
    this.deviceDetailLabelName=device.deviceName;
    this.deviceDetailId=device.deviceId;
    // this.detail.DeviceLabelName=device.DeviceId;
    
   
  }
  
  AddDeviceSubmit=async()=>{
   
    if(this.deviceAddTagName=="")
      this.showDeviceTagNameMsg=true;
    else
      this.showDeviceTagNameMsg=false;
    if(this.deviceAddLabelName=="")
      this.showDeviceLabelNameMsg=true;
    else  
      this.showDeviceLabelNameMsg=false;
    if(this.deviceAddTagName!=""&& this.deviceAddLabelName!="")
    {
    this.userdevice.TagName=this.deviceAddTagName;
    this.userdevice.DeviceName=this.deviceAddLabelName;
    this.userdevice.UserId=this.user.userId;

     const promise=await this.deviceservice.addDevice(this.userdevice).toPromise().then(res => { 
      
        this.resultmapdevice=res;
        alert(this.resultmapdevice.message);
        if(this.resultmapdevice.isDeviceUserAssociationSucceded)
        this.AddDeviceClose.nativeElement.click();
        
        
        this.getAllUserById(this.user.userId);
      })
      .catch(res=>
        {alert('Error occured during device mapping.\n Error: '+JSON.stringify(res))
      });
       
    }
    
   
  }
 
  DetailDeviceSubmit=async()=>{
    this.CheckValues();
   if(this.addPaneFlag==true)
    {
    const paneCount=sessionStorage.getItem('paneCount');
    if(paneCount!=null)
    this.paneDetails.Index=Number(paneCount);
    this.paneDetails.Size='small';
    this.paneDetails.DeviceName=this.deviceDetailLabelName;
    this.paneDetails.DeviceId=this.deviceDetailId;
      const promise=await this.deviceservice.addPanelDetails(this.paneDetails).toPromise().then(data=>
      {
        var paneId=data;
        if(paneId>0)
        {
          var configDetail=[];
          configDetail= this.PrepareConfigData(paneId);
          const promise= this.deviceservice.addConfigDetails(configDetail).toPromise().then(data=>
            {
              alert('Pane added succesfully.');
            })
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
    this.allGraphShowFalse();
    this.showCurrentLocation=false;
    this.showParam=false;
    this.DetailDeviceClose.nativeElement.click();
    }
    this.addPaneFlag=true;
  }
  CheckValues()
  {
    if(this.DataTypeValue=="" || this.DataTypeValue=="SelectDataType")
      {this.showDataTypeMsg=true;
        this.addPaneFlag=false;
      }
    else{
      this.showDataTypeMsg=false;
      if(this.DataTypeValue=="LiveData")
      {
      if(this.checkedAttrNames.length==0)
      {
       this.showParamMsg=true;
       this.addPaneFlag=false;
      }
      else
      this.showParamMsg=false;
    }
    else if(this.DataTypeValue=="Graph"){
      if(this.GraphTypeValue==""||this.GraphTypeValue=="SelectGraphType"){
        this.showGraphTypeMsg=true;
        this.addPaneFlag=false;
      }
      else{
        this.showGraphTypeMsg=false;
      if(this.GraphTypeValue=="LineChart")
      {
        if(this.LineChart=="SelectAttribute" || this.LineChart=="")
        {
          this.showLineChartMsg=true;
          this.addPaneFlag=false;
        }
        else
        this.showLineChartMsg=false;
      }
      else if(this.GraphTypeValue=="BarGraph")
      {

        if(this.BarChart=="SelectAttribute" || this.BarChart=="")
        {
          this.showBarChartMsg=true;
          this.addPaneFlag=false;
        }
        else
        this.showBarChartMsg=false;
      }
      else if(this.GraphTypeValue=="PieChart")
      {
        
        if(this.PieChart=="SelectAttribute" || this.PieChart=="")
        {
          this.showPieChartMsg=true;
          this.addPaneFlag=false;
        }
        else
        this.showPieChartMsg=false;
    
      }
      else if(this.GraphTypeValue=="GaugeChart")
      {
        if(this.GaugeChart=="SelectAttribute" || this.GaugeChart=="")
        {
          this.showGaugeChartMsg=true;
          this.addPaneFlag=false;
        }
        else
        this.showGaugeChartMsg=false;

        if( this.lowValue=="")
        {
          this.showLowValueMsg=true;
          this.addPaneFlag=false;
        }
        else
        this.showLowValueMsg=false;
        if( this.highValue=="")
        {
          this.showHighValueMsg=true;
          this.addPaneFlag=false;
        }
        else
        this.showHighValueMsg=false;
        if( this.mediumValue=="")
        {
          this.showMediumValueMsg=true;
          this.addPaneFlag=false;
        }
        else
        this.showMediumValueMsg=false;

        if( this.alertValue=="")
        {
          this.showAlertValueMsg=true;
          this.addPaneFlag=false;
        }
        else
        this.showAlertValueMsg=false;
    
      }
    }
    }
    else if(this.DataTypeValue=="Map"){
      if(this.MapTypeValue==""||this.MapTypeValue=="SelectMapType")
      {
        this.showMapTypeMsg=true;
        this.addPaneFlag=false;
      }
      else
      {
        this.showMapTypeMsg=false;
        if(this.MapTypeValue=="CurrentLocation"){
          if(this.Latitude=="SelectAttribute" || this.Latitude=="")
          {
            this.showLatitudeMsg=true;
            this.addPaneFlag=false;
          }
          else
          this.showLatitudeMsg=false;
          if(this.Longitude=="SelectAttribute" || this.Longitude=="")
          {
            this.showLongitudeMsg=true;
            this.addPaneFlag=false;
          }
          else
          this.showLongitudeMsg=false;
        }
        
      }
     
    }
    }

   

  }

  PrepareConfigData(paneid:number):any{
    this.configs=[];
    if(this.DataTypeValue=="LiveData")
    {
      
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
  
    
  onDataTypeSelected(selectedValue:string){
    this.allGraphShowFalse();
    this.showCurrentLocation=false;
    this.showParam=false;
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










  
  

