import { Injectable } from '@angular/core';

import { HttpClient,HttpHeaders} from '@angular/common/http';

import {Observable} from "rxjs/index";
import {DeviceModel,DeviceAddModel,UserDeviceModel} from './device/device-model'

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  ApiUrl:string='http://localhost:50364/api/Device/DeviceList';
  addDeviceApiUrl:string='http://localhost:50364/api/Device/AddDevice';
  addDeviceToUserApiUrl:string='http://localhost:50364/api/Device/UserDeviceAssociation';
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'JSON(application/json)'
     
    })
  };
 
  
 
  constructor(private http:HttpClient) { 
    
    
  }

  getAllDeviceList(UserId:number):Observable<DeviceModel[]>{
    
    return this.http.get<DeviceModel[]>(this.ApiUrl+'/'+UserId.toString());
    
  }
   
  addDevice(userdevice:UserDeviceModel):Observable<any>
  {
   const headers = new HttpHeaders()
   headers.set('content-type', 'application/json'); 
   headers.set('Access-Control-Allow-Credentials', 'true'); 
   headers.set('Access-Control-Allow-Origin', '*'); 
   headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS'); 
   headers.set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'); 
    

    return this.http.post<any>(this.addDeviceToUserApiUrl,userdevice,{headers});
    
  
  }
  updateDevice(device:DeviceModel):Observable<any>
  {
    return this.http.put(this.ApiUrl,device);
  }
  deleteDevice()
  {
  window.alert('Device deleted');
  }
  
  getDeviceDetail()
  {

  }
  updateDeviceDetail()
  {
  window.alert('Device detail updated'); 
  }
}
