import { Injectable } from '@angular/core';

import { HttpClient, HttpParams,HttpHandler,HttpHeaders} from '@angular/common/http';
import {DashboardModel} from './dashboard/dashboard-model';
import {Observable} from "rxjs/index";
import { JsonPipe} from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class IotDataService {
deviceData:any;
dashboard:DashboardModel=new DashboardModel();
dashboards:Array<DashboardModel>=[];

  constructor(private http:HttpClient) { }

  //https://api.wisethingz.com/Dev/thingsapi?thingname=parv&count=3
  getDeviceData():Observable<DashboardModel[]> {
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    const endpoint = 'http://localhost:50364/api/Device/DeviceData';
    // const endpoint = 'http://52.14.214.29/api/Device/DeviceData';
     return this.http.get<DashboardModel[]>(endpoint);

     //return this.http.get<DashboardModel[]>(endpoint,httpOptions);
    
    
        
  }
}

