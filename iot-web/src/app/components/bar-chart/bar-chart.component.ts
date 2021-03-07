import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardModel } from 'src/app/dashboard/dashboard-model';
import { IotDataService } from 'src/app/iot-data.service';
import { IChart } from '../../models/ichart';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, OnDestroy, IChart {

  public chartDetails: any;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels: string[] = [];

  public barChartType = 'bar';

  public barChartLegend = true;

  public barChartData: Array<any> = [];

  public setIntervalHandle: any;

  constructor(private iotdataservice: IotDataService) {
  }

  ngOnInit(): void {
    this.getDeviceData();
    this.setIntervalHandle = setInterval(_ => this.getDeviceData(), 30000);
  }

  public getDeviceData() {
    this.iotdataservice.getDeviceData()
      .subscribe((devicesdata: DashboardModel[]) => {
        this.barChartLabels = [];
        devicesdata.forEach(d => {
          if(!this.barChartLabels.includes(d.thingname)){
            this.barChartLabels.push(d.thingname);
          }
        });
        
        this.barChartData = devicesdata
        .map(d => ({
          label: d.content.loc,
          data: [d.content.temp]
        }));
        console.log(this.barChartData);
      });
  }

  ngOnDestroy() {
    if (this.setIntervalHandle) {
      clearInterval(this.setIntervalHandle);
    }
  }

}
