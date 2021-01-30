export class DeviceModel {
    DeviceId:number;
    DeviceUniqueIdentifier:string;
    DeviceTagName:string;
    InputDate:string;
    InputBy:number;
    
    constructor(deviceId: number,deviceUniqueIdentifier:string,deviceTagName:string,inputDate:string,inputBy:number   ) {
        
        this.DeviceId = deviceId;
        this.DeviceUniqueIdentifier=deviceUniqueIdentifier;
        this.DeviceTagName=deviceTagName;
        this.InputDate=inputDate;
        this.InputBy = inputBy;

        
    }
}

export class DeviceDetail{
    DeviceLabelName?:number;
    DataType?:string;
}
