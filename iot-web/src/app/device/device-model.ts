export class DeviceModel {
    deviceId:number;
    deviceUniqueIdentifier:string;
    deviceTagName:string;
    inputDate:Date;
    inputBy:number;
    
    constructor(deviceId: number,deviceUniqueIdentifier:string,deviceTagName:string,inputDate:Date,inputBy:number   ) {
        
        this.deviceId = deviceId;
        this.deviceUniqueIdentifier=deviceUniqueIdentifier;
        this.deviceTagName=deviceTagName;
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
