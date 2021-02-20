import { Injectable } from '@angular/core';

import { HttpClient,HttpHeaders} from '@angular/common/http';

import {Observable} from "rxjs/index";
import {DeviceModel,DeviceAddModel,UserDeviceModel,PaneDetails,ConfigDetails} from './device/device-model'

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  ApiUrl:string='http://localhost:50364/api/Device/DeviceList';
  addDeviceApiUrl:string='http://localhost:50364/api/Device/AddDevice';
  addDeviceToUserApiUrl:string='http://localhost:50364/api/Device/UserDeviceAssociation';
  panelDetailsApi:string='http://localhost:50364/api/Pane/AddPaneDetails';
  configDetailsApi:string='http://localhost:50364/api/Pane/AddConfigDetails';
  
  // ApiUrl:string='http://52.14.214.29/api/Device/DeviceList';
  // addDeviceApiUrl:string='http://52.14.214.29/api/Device/AddDevice';
  // addDeviceToUserApiUrl:string='http://52.14.214.29/api/Device/UserDeviceAssociation';
  // panelDetailsApi:string='http://52.14.214.29/api/Pane/AddPaneDetails';
  // configDetailsApi:string='http://52.14.214.29/api/Pane/AddConfigDetails';
  

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

  getAttributeNames(deviceName:string):Observable<string[]> {
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    const endpoint = 'http://localhost:50364/api/Pane/AttributeName/'+deviceName;
    // const endpoint = 'http://52.14.214.29/api/Pane/AttributeName/'+deviceName;
     return this.http.get<string[]>(endpoint);

     //return this.http.get<DashboardModel[]>(endpoint,httpOptions);
        
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
  addPanelDetails(paneDetails:PaneDetails):Observable<any>
  {
    const headers = new HttpHeaders()
    headers.set('content-type', 'application/json'); 
    headers.set('Access-Control-Allow-Credentials', 'true'); 
    headers.set('Access-Control-Allow-Origin', '*'); 
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS'); 
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'); 
     
    return this.http.post<any>(this.panelDetailsApi,paneDetails,{headers});
    
  }
  addConfigDetails(configDetails:ConfigDetails[]):Observable<any>
  {
    const headers = new HttpHeaders()
    headers.set('content-type', 'application/json'); 
    headers.set('Access-Control-Allow-Credentials', 'true'); 
    headers.set('Access-Control-Allow-Origin', '*'); 
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS'); 
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'); 
     
    
    return this.http.post<any>(this.configDetailsApi,configDetails,{headers});
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
