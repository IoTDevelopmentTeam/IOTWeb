import { Component, ComponentFactoryResolver, Input, OnInit, ViewContainerRef } from '@angular/core';
import { chartMap } from 'src/app/models/app-constants';
import { ChartDetails } from 'src/app/models/chart-details';
import { IChart } from '../../models/ichart';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @Input()
  public chartinfo: ChartDetails;

  constructor(private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver) { 
      this.chartinfo = new ChartDetails();
  }

  ngOnInit(): void {
    const factory = this.componentFactoryResolver
    .resolveComponentFactory<IChart>(chartMap[this.chartinfo.chartType]);
    const componenet = this.viewContainerRef.createComponent(factory);
    componenet.instance.chartDetails = {};
  }

}
