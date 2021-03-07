import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import {DashboardModel} from './dashboard-model';
import {IotDataService} from '../iot-data.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChartDetails } from '../models/chart-details';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../CSS/light.css','./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  lat:number = 13;
  lng:number = 80;
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
          ticks: {
              suggestedMin: 0
              
          }
      }]
    }
  };
  public barChartLabels:Array<string>= [];
  public barChartType = 'bar' as ChartType;
  public barChartLegend = true;
  public barChartData = [
    {data:[1,2,3], label: ''}    
  ];

  public lineChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
          ticks: {
              suggestedMin: 0,
              suggestedMax: 100
          }
      }]
    }
  };
  public lineChartLabels:Array<string>= [];
  public lineChartType = 'line' as ChartType;
  public lineChartLegend = true;
  public lineChartData = [
    {data:[1,2,3], label: ''}    
  ];

  dashboarddata:DashboardModel=new DashboardModel();
  dashboarddatas: Array<DashboardModel>=[];

  public preferences: Array<any>;

  constructor(private iotdataservice:IotDataService) { 
    this.dashboarddatas=[];
    this.barChartData[0].data=[];
    this.lineChartData[0].data=[];
    this.preferences = [];
    for (let index = 0; index < 8; index++) {
      const chartDetail: ChartDetails = {
        chartType: index % 2 == 0 ? 'bar-chart' : 'line-chart'
      };
      this.preferences.push({
        index : index,
        chart: chartDetail
      });
    }
  }

  ngOnInit(): void {
    this.getDeviceData();
    
  }
  getDeviceData(){
        
     this.iotdataservice.getDeviceData().subscribe(data=>
      {
        this.dashboarddatas=data;
        for(let data of this.dashboarddatas)
        {
         this.barChartLabels.push(data.content.loc);
         this.barChartData[0].data.push(data.content.temp);
         this.lineChartLabels.push(data.content.loc);
         this.lineChartData[0].data.push(data.content.temp);
         this.barChartData[0].label=data.thingname;
         this.lineChartData[0].label=data.thingname;
        } 
      }
    );
  }

  public drop(event: CdkDragDrop<any[]>, destRowIndex: number){
    const temp = this.preferences[event.item.data.index];
    this.preferences[event.item.data.index] = this.preferences[destRowIndex];
    this.preferences[destRowIndex] = temp;
    this.preferences.forEach((x, i) => x.index = i);
  }

}
