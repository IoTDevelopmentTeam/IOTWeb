import { BarChartComponent } from "../components/bar-chart/bar-chart.component";
import { LineChartComponent } from "../components/line-chart/line-chart.component";

interface IChartMap {
    [key: string] : any
}

export const chartMap : IChartMap = {
    "bar-chart" : BarChartComponent,
    "line-chart" : LineChartComponent
}


