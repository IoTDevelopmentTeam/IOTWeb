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

  public preferences: Array<any>;

  constructor(private iotdataservice:IotDataService) { 
    this.preferences = [];
    // Used for local testing without api
    // Once api is available, load user `preferences` from api
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
  }

  /**
   * Event Handler to Handle Drag Drop Event and swap items.
   * @param event 
   * @param destRowIndex 
   */
  public drop(event: CdkDragDrop<any[]>, destRowIndex: number){
    const temp = this.preferences[event.item.data.index];
    this.preferences[event.item.data.index] = this.preferences[destRowIndex];
    this.preferences[destRowIndex] = temp;
    this.preferences.forEach((x, i) => x.index = i);
  }

}
