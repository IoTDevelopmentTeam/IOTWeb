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
    IsDeviceUserAssociationSucceded:boolean=false;
    Mmessage:string='';
}
export class DeviceAddModel {
   
    DeviceUniqueIdentifier:string='';
    DeviceTagName:string='';
    InputDate:Date=new Date();
    InputBy:string='';
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
    PositionX :number=0.0;
    PositionY :number=0.0;
    Height:number=0.0;
    Width :number=0.0;

}
