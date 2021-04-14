import { ChartType,ChartDataSets } from "chart.js";
import { Label } from "ng2-charts";

export class DeviceModel {
    deviceId:number;
    deviceUniqueIdentifier:string;
    deviceTagName:string;
    deviceName:string;
    inputDate:Date;
    inputBy:number;
    
    constructor(deviceId: number,deviceUniqueIdentifier:string,deviceTagName:string,deviceName:string,inputDate:Date,inputBy:number   ) {
        
        this.deviceId = deviceId;
        this.deviceUniqueIdentifier=deviceUniqueIdentifier;
        this.deviceTagName=deviceTagName;
        this.deviceName=deviceName;
        this.inputDate=inputDate;
        this.inputBy = inputBy;

        
    }
}

export class UserDeviceModelResult{
    isDeviceUserAssociationSucceded:boolean=false;
    message:string='';
}
export class DeviceAddModel {
   
    DeviceLabelName:string='';
    DeviceTagName:string='';
    InputDate:Date=new Date();
    InputBy:string='';
}

export class DeviceNameEdit {
   
    DeviceTagName:string='';
    DeviceName:string='';
    
}

export class DeviceAdminModel {
   
    deviceLabelName:string='';
    deviceTagName:string='';
    deviceName:string='';
    inputDate:Date=new Date();
    inputBy:string='';
    isUsed:boolean=false;
    firstUse?:Date;
    expDate?:Date;
   
}
export class UserDeviceModel{
    DeviceName:string='';
    TagName:string='';
    UserId:number=0;
}

export class DeviceDetail{
    DeviceLabelName?:number;
    DataType?:string;
}

export class ConfigDetails
{
    Id:number=0;
    MasterId:number=0;
    PaneId :number=0;
    ParameterName:string='';
    ParameterValue :string='';
    constructor(MasterId:number,PaneId:number,ParameterName:string,ParameterValue:string) {
        
        this.MasterId=MasterId;
        this.PaneId=PaneId;
        this.ParameterName=ParameterName;
        this.ParameterValue=ParameterValue;        
    }
    
}

export class PaneDetails
{
    PaneId:number=0; 
    DeviceId :number=0;
    DeviceName:string='';
    Index:number=0;
    Size:string='';

}

export class PaneDetailsFetch
{
    index:number=0;
    paneId:number=0; 
    deviceId :number=0;
    deviceName:string='';
    chartType:string='';
    chartLineBarData = [
        { data: [1,2,3], label: '',backgroundColor:[], borderColor:[],hoverBackgroundColor:[]},
      ] as ChartDataSets[];
    chartPieData = [
        { data: [1,2,3], label: ''},
      ];
    liveDataLabel = [{caption:'',value:''},];
    chartGaugeData = [
        { data: [1,2,3],backgroundColor:[''],borderWidth :0,hoverBackgroundColor:[''],hoverBorderWidth:0 }
      ] ;
     
    isLiveData:boolean=false;
    
    chartLabels: Label[] = ['', '', '', '', '', ''];
    chartReady:boolean = false;
    size:string='small';
    cssClass:string='';
    chartLegend = true;
    chartPlugins = [];
    isMap:boolean=false;
    mapType:string='';
}
export class ConfigDetailsFetch
{
    id:number=0;
    masterId:number=0;
    paneId :number=0;
    parameterName:string='';
    parameterValue :string='';
}

