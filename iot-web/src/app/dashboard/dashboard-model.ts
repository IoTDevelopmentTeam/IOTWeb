export class DashboardModel {
    //content:Array<{[key: string]: string}>=new Array<{[key: string]: string}>();
    content:data=new data();
    thingname:string='';
    ctime:string='';
    ptime:string='';
}

export class DeviceAssociationResult
    {
        IsDeviceUserAssociationSucceded:boolean=false;
        Message:string='';
    }

export class data{
    loc:string='';
    temp:number=0;
}

