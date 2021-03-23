import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';

import {Observable} from "rxjs/index";
import {DeviceAddModel,DeviceAdminModel} from './device/device-model'
import { data } from './dashboard/dashboard-model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // addDeviceApiUrl:string='http://localhost:50364/api/Device/AddDevice';
  // getDeviceList:string='http://localhost:50364/api/Device/DeviceListAdmin';
  // updateDeviceApiUrl:string='http://localhost:50364/api/Device/UpdateDevice';

  addDeviceApiUrl:string='http://52.14.214.29/api/Device/AddDevice';
  getDeviceList:string='http://52.14.214.29/api/Device/DeviceListAdmin';
  updateDeviceApiUrl:string='http://52.14.214.29/api/Device/UpdateDevice';

  constructor(private http:HttpClient) { }

  addDevice(devices:DeviceAddModel[]):Observable<string>
  {
  const headers = new HttpHeaders()
   headers.set('content-type', 'application/json'); 
   headers.set('Access-Control-Allow-Credentials', 'true'); 
   headers.set('Access-Control-Allow-Origin', '*'); 
   headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS'); 
   headers.set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'); 
  
   return this.http.post(this.addDeviceApiUrl,devices,{headers,responseType: 'text'});
   
    
  }

  getAllDeviceList():Observable<DeviceAdminModel[]>{
    
    return this.http.get<DeviceAdminModel[]>(this.getDeviceList);
    
  }

  UpdateDevice(device:DeviceAdminModel):Observable<any>
  {
  const headers = new HttpHeaders()
   headers.set('content-type', 'application/json'); 
   headers.set('Access-Control-Allow-Credentials', 'true'); 
   headers.set('Access-Control-Allow-Origin', '*'); 
   headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS'); 
   headers.set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'); 
  
   return this.http.post(this.updateDeviceApiUrl,device,{headers,responseType: 'text'});
  }
   
    
    
}
