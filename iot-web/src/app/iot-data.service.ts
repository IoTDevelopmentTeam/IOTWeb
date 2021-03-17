import { Injectable } from '@angular/core';

import { HttpClient, HttpParams,HttpHandler,HttpHeaders} from '@angular/common/http';
import {DashboardModel1} from './dashboard/dashboard-model';
import {Observable} from "rxjs/index";
import { JsonPipe} from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class IotDataService {
deviceData:any;
dashboard:DashboardModel1=new DashboardModel1();
dashboards:Array<DashboardModel1>=[];

  constructor(private http:HttpClient) { }

  //https://api.wisethingz.com/Dev/thingsapi?thingname=parv&count=3
  getDeviceData(id:number):Observable<DashboardModel1[]> {
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    const endpoint = 'http://localhost:50364/api/Device/DeviceData/'+id.toString();
    // const endpoint = 'http://52.14.214.29/api/Device/DeviceData/'+id.toString();
     return this.http.get<DashboardModel1[]>(endpoint);

     //return this.http.get<DashboardModel[]>(endpoint,httpOptions);
    
    
        
  }
}

