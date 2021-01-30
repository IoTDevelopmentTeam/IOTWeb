import { Injectable } from '@angular/core';

import { HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from "rxjs/index";
import {DeviceModel} from './device/device-model'

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  ApiUrl:string='http://localhost:50364/api/Device/DeviceList';
  addDeviceApiUrl:string='http://localhost:50364/api/Device/AddDevice';
  
  constructor(private http:HttpClient) { 
   
  }

  getAllDeviceList(UserId:number):Observable<DeviceModel[]>{
    console.log('test');
    console.log(this.http.get<DeviceModel[]>(this.ApiUrl+'/'+UserId.toString()));
    return this.http.get<DeviceModel[]>(this.ApiUrl+'/'+UserId.toString());
    
  }
   
  addDevice(device:DeviceModel):Observable<any>
  {
    window.alert(device.DeviceTagName);
    window.alert(device.InputBy);
    window.alert(device.InputDate);
    return this.http.post(this.addDeviceApiUrl,device);
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
