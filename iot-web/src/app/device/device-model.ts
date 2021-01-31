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

export class DeviceAddModel {
    DeviceId:number=0;
    DeviceUniqueIdentifier:string='';
    DeviceTagName:string='';
    InputDate:Date=new Date();
    InputBy:number=0;
}

export class DeviceDetail{
    DeviceLabelName?:number;
    DataType?:string;
}
