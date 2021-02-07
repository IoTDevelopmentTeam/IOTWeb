import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';

import {Observable} from "rxjs/index";
import {DeviceAddModel} from './device/device-model'
import { data } from './dashboard/dashboard-model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  addDeviceApiUrl:string='http://localhost:50364/api/Device/AddDevice';

  constructor(private http:HttpClient) { }

  addDevice(device:DeviceAddModel):Observable<string>
  {
  const headers = new HttpHeaders()
   headers.set('content-type', 'application/json'); 
   headers.set('Access-Control-Allow-Credentials', 'true'); 
   headers.set('Access-Control-Allow-Origin', '*'); 
   headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS'); 
   headers.set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'); 
  
   return this.http.post(this.addDeviceApiUrl,device,{headers,responseType: 'text'});
   
  
   
  }
    
}
