import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label} from 'ng2-charts';
import {DashboardModel1} from './dashboard-model';
import {IotDataService} from '../iot-data.service';
import { DeviceModel,DeviceDetail,UserDeviceModel,UserDeviceModelResult,PaneDetailsFetch,ConfigDetailsFetch, PaneDetails } from '../device/device-model';
import { UserModel } from '../login/user-model';

import { DeviceService } from '../device.service';
import { UserService } from '../user.service';
import { identifierName } from '@angular/compiler';
import { NumberFormatStyle } from '@angular/common';
import { Observable } from 'rxjs';


import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { bottom } from '@popperjs/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../CSS/light.css']
})
export class DashboardComponent implements OnInit {
  

  devices: Array<DeviceModel>=[];
  paneDetails:Array<PaneDetailsFetch>=[];
  panedetailsUpdate:PaneDetails=new PaneDetails();
  panedetailsRemove:PaneDetails=new PaneDetails();
  configDetails:Array<ConfigDetailsFetch>=[];
  xaxis:string='';
  yaxis:string='';
  user:UserModel=new UserModel();

  
  public chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
          ticks: {
              suggestedMin: 0,
              fontSize:15,
              fontColor:'black',
              
          }
          
      }],
      xAxes: [{
        ticks: {
            fontSize:15,
            fontColor:'black',
        }
      }],
        
    },
    legend: {
      labels:{
      fontSize:15,
      fontColor:'#6495ED',
      }
    }
    
  };
  public pieChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };


  public gaugeOptions = {
    cutoutPercentage: 0,
    rotation: -3.1415926535898,
    circumference: 3.1415926535898,
    legend: {
        "display": false
    },
    tooltips: {
        "enabled": false
    },
    title: {
        "display": true,
        "text": "",
       // "position": bottom,
        fontColor:'#005cff',
        fontSize:15,
    }
  };
  


  
  dashboarddata:DashboardModel1=new DashboardModel1();
  dashboarddatas: Array<DashboardModel1>=[];

  constructor(private iotdataservice:IotDataService,private deviceservice:DeviceService) { 
    this.dashboarddatas=[];
        
  }

  ngOnInit(): void {
   
    const userstring=sessionStorage.getItem('loggedinuser');
    if(userstring!=null)
    { const loggedinuser = JSON.parse(userstring);
      this.user=loggedinuser;
      var UserId=this.user.userId;
            
      // this.user=this.userservice.getUser();
      const userdevices=sessionStorage.getItem('userdevices');
      if(userdevices!=null)
      this.devices=JSON.parse(userdevices);
      
    //  this.getDetail(this.devices);
    // setInterval(() => { 
    //   this.getDetail(UserId),60000});
 
    // this.getDetail(UserId);

    var that=this;
    let timerId =setTimeout(function prepareDashboard() {
      
      that.getDetail(UserId);
      timerId=setTimeout(prepareDashboard, 900000);
    }, 0);
    
    }
  }
  
  public getDetail=async(id:number)=>{//(devices:DeviceModel[])=>{
    // for(var i=0;i<devices.length;i++)
    // {
      
     
      this.paneDetails=[];
      //this.getPaneDetail(this.devices[i].deviceId,this.paneDetails);
      await this.deviceservice.getPaneDetail(id).toPromise().then(res => { // Success
    
        if(res.length!=0)
        res.forEach(element => {
          this.paneDetails.push(element);
        });
      })
      
    // }
    sessionStorage.setItem('paneCount',this.paneDetails.length.toString());
    for(var i=0;i<this.paneDetails.length;i++)
    { 
      if(this.paneDetails[i].index==null)
        this.paneDetails[i].index=i; 
      if(this.paneDetails[i].size==null)
        this.paneDetails[i].size="small";
      if(this.paneDetails[i].size=="small"){
       this.paneDetails[i].cssClass="col-md-4"; 
      }
      else if(this.paneDetails[i].size=="mid"){
       this.paneDetails[i].cssClass="col-md-8"; 
        }
      else {
        this.paneDetails[i].cssClass="col-md-12";
        
      }
      this.getConfigDetail(this.paneDetails[i].paneId,i,this.paneDetails[i].deviceId);
      
    }  
    
  }

  getPaneDetail= async(id:number,paneDetail:PaneDetailsFetch[])=>{
    const promise=await this.deviceservice.getPaneDetail(id).toPromise().then(res => { // Success
      
      if(res.length!=0)
      res.forEach(element => {
        paneDetail.push(element);
      
      });
     return paneDetail;
          
  })
  .catch(res=>
  {
    Swal.fire('Error!', 'Error occured during Pane Detail fetching.\n Error: '+JSON.stringify(res), 'error');
  });
  } 

  getConfigDetail=async(id:number,paneSlNo:number,deviceId:number)=>{
    const promise=await this.deviceservice.getConfigDetail(id).toPromise().then(res => { // Success
      this.configDetails=res;
      var paneType='' as ChartType; 
      var lowvalue:number=0;
      var midvalue:number=0;
      var highvalue:number=0;
      var alertvalue:number=0;
      var gaugeattribute:string='';
      if(this.configDetails[0].masterId==1)
      {
        var paramValue:string[]=[];
        for(var i=0;i<this.configDetails.length;i++)
        {
          paramValue.push(this.configDetails[i].parameterValue);
        }
        this.paneDetails[paneSlNo].deviceName=this.paneDetails[paneSlNo].deviceName+' (Live Data)';
        this.getDeviceDataLiveData(deviceId,paneSlNo,paramValue); 
      } 
      else if(this.configDetails[0].masterId==2){
      paneType='line' as ChartType;
      this.paneDetails[paneSlNo].deviceName=this.paneDetails[paneSlNo].deviceName+' (Line Chart)';
      }
      else if(this.configDetails[0].masterId==3){
      paneType='bar' as ChartType;
      this.paneDetails[paneSlNo].deviceName=this.paneDetails[paneSlNo].deviceName+' (Bar Chart)';
    }
      else if(this.configDetails[0].masterId==4)
      {
      paneType='pie' as ChartType;
      this.paneDetails[paneSlNo].deviceName=this.paneDetails[paneSlNo].deviceName+' (Pie Chart)';
      }
      else if(this.configDetails[0].masterId==5)
      {
      paneType='doughnut' as ChartType;
      this.paneDetails[paneSlNo].deviceName=this.paneDetails[paneSlNo].deviceName+' (Gauge Chart)';
      }
      else if(this.configDetails[0].masterId==6  )
      {
        var latValue='',longValue='';
        for(var i=0;i<this.configDetails.length;i++)
        {
          if(this.configDetails[i].parameterName=="Latitude")
            latValue=this.configDetails[i].parameterValue;
          else if(this.configDetails[i].parameterName=="Longitude")
            longValue=this.configDetails[i].parameterValue;
        }
        this.paneDetails[paneSlNo].deviceName=this.paneDetails[paneSlNo].deviceName+' (Current Location)';
        this.getCurrentLocationData(deviceId,paneSlNo,latValue,longValue);
      }
      else if(this.configDetails[0].masterId==7 )
      {
        var latValue='',longValue='';
        for(var i=0;i<this.configDetails.length;i++)
        {
          if(this.configDetails[i].parameterName=="Latitude")
            latValue=this.configDetails[i].parameterValue;
          else if(this.configDetails[i].parameterName=="Longitude")
            longValue=this.configDetails[i].parameterValue;
        }
        this.paneDetails[paneSlNo].deviceName=this.paneDetails[paneSlNo].deviceName+' (Route Map)';
        this.getRouteMapData(deviceId,paneSlNo,latValue,longValue);
      }
      this.paneDetails[paneSlNo].chartType=paneType;
      if(this.paneDetails[paneSlNo].chartType=='bar'||this.paneDetails[paneSlNo].chartType=='line')
      {
        for(var i=0;i<this.configDetails.length;i++)
        {
          if(this.configDetails[i].parameterName=="X-axis")
            this.xaxis=this.configDetails[i].parameterValue;
          if(this.configDetails[i].parameterName=="Y-axis")
            this.yaxis=this.configDetails[i].parameterValue;
        }
        this.getDeviceDataLineBar(deviceId,paneSlNo,this.xaxis,this.yaxis); 
      } 
      else if(this.paneDetails[paneSlNo].chartType=='doughnut')
      { 
        var lowmidhighalert:number[]=[];
        for(var i=0;i<this.configDetails.length;i++)
        {
          
          if(this.configDetails[i].parameterName=="LowValue")
            lowvalue=Number(this.configDetails[i].parameterValue);
          else if(this.configDetails[i].parameterName=="MidValue")
            midvalue=Number(this.configDetails[i].parameterValue);
          else if(this.configDetails[i].parameterName=="HighValue")
            highvalue=Number(this.configDetails[i].parameterValue);
          else if(this.configDetails[i].parameterName=="AlertValue")
            alertvalue=Number(this.configDetails[i].parameterValue);
          else if(this.configDetails[i].parameterName=="Attribute")
            gaugeattribute=this.configDetails[i].parameterValue;
        }
        lowmidhighalert[0]=lowvalue;
        lowmidhighalert[1]=midvalue;
        lowmidhighalert[2]=highvalue;
        lowmidhighalert[3]=alertvalue;
        this.getDeviceDataGauge(deviceId,paneSlNo,lowmidhighalert,gaugeattribute); 
      }
      else if(this.paneDetails[paneSlNo].chartType=='pie') 
        this.getDeviceDataPie(deviceId,paneSlNo,this.configDetails[0].parameterValue); 
     
  })
  .catch(res=>
  {
    Swal.fire('Error!', 'Error occured during Config Detail fetching.\n Error: '+JSON.stringify(res), 'error');
    });
  } 
  getDeviceDataLineBar=async(id:number,paneSlNo:number,xaxis:string,yaxis:string)=>{
      var xaxisvalue:Array<string[]>=[];
      var yaxisvalue:number[]=[]; 
      var bgcolor:string[]=[];
      var bcolor:string[]=[];
      var hoverBgColor:string[]=[];
      var hoverBColor:string[]=[];
      var fontColor:string[]=[];
     
      const promise=await this.iotdataservice.getDeviceData(id).toPromise().then(data=>
      {
        this.dashboarddatas=data;
        this.paneDetails[paneSlNo].chartLabels=xaxisvalue;
        this.paneDetails[paneSlNo].chartLineBarData = [
          { data: [], label: '' ,backgroundColor:[], borderColor:[],hoverBackgroundColor:[]},
        ];
        var prevDate:string="00/00/0000";    
        for(var j=this.dashboarddatas.length-1;j>=0;j--)
        {
          let data1 =this.dashboarddatas[j];
           var param= JSON.stringify(data1.content).replace("{","").replace("}","").split(',');
           
            for(var i=0;i<param.length;i++)
              {
                var paramValue=param[i].split(':');
                if(paramValue[0]=='"'+xaxis+'"')
                  xaxisvalue.push([paramValue[1]]);
                if(paramValue[0]=='"'+yaxis+'"')
                  yaxisvalue.push(Number(paramValue[1].replace("\"","").replace("\"","")));
                  bgcolor.push('#6495ED');
                  bcolor.push('#6495ED');
                  hoverBgColor.push('#6495ED');
                  hoverBColor.push('#6495ED');
                  
              }
              if(xaxis=="Time")
              {
                if(new Date(data1.ptime).toLocaleDateString()!=prevDate)
                  {// xaxisvalue.push(new Date(data1.ptime).toLocaleString());
                    var month=new Date(data1.ptime).getMonth();
                    var date=new Date(data1.ptime).getDate();
                    var year=new Date(data1.ptime).getFullYear();
                    xaxisvalue.push([month+"/"+date+"/"+year,new Date(data1.ptime).toLocaleTimeString()]);
                    // xaxisvalue.push(['abc',new Date(data1.ptime).toLocaleTimeString()]);
                  }
                else
                  xaxisvalue.push([new Date(data1.ptime).toLocaleTimeString()]);
                prevDate=new Date(data1.ptime).toLocaleDateString();
              }

              // if(j%3==1)
              // {
              //   bgcolor.push('#488A99');
              //     bcolor.push('#488A99');
              //     hoverBgColor.push('#488A99');
              //     hoverBColor.push('#488A99');

              // }
              // else  if(j%3==2)
              // {
              //   bgcolor.push('#1C4E80');
              //     bcolor.push('#1C4E80');
              //     hoverBgColor.push('#1C4E80');
              //     hoverBColor.push('#1C4E80');

              // }
              // else{
              //       bgcolor.push('#0091D5');
              //       bcolor.push('#0091D5');
              //       hoverBgColor.push('#0091D5');
              //       hoverBColor.push('#0091D5');
  
                
              // }
              bgcolor.push('#6495ED');
              bcolor.push('#6495ED');
              hoverBgColor.push('#6495ED');
              hoverBColor.push('#6495ED');
              fontColor.push('#6495ED');
         } 
              
          this.paneDetails[paneSlNo].chartLineBarData[0].data=yaxisvalue;
          this.paneDetails[paneSlNo].chartLineBarData[0].label=yaxis;
          this.paneDetails[paneSlNo].chartLineBarData[0].backgroundColor=bgcolor;
          this.paneDetails[paneSlNo].chartLineBarData[0].borderColor=bcolor;
          this.paneDetails[paneSlNo].chartLineBarData[0].hoverBackgroundColor=hoverBgColor;
          this.paneDetails[paneSlNo].chartLineBarData[0].hoverBorderColor=hoverBColor;
          this.paneDetails[paneSlNo].chartLineBarData[0].pointBackgroundColor=hoverBColor;
          this.paneDetails[paneSlNo].chartLineBarData[0].pointBorderColor=hoverBColor;
          this.paneDetails[paneSlNo].chartLineBarData[0].pointHoverBackgroundColor=hoverBColor;
          this.paneDetails[paneSlNo].chartLineBarData[0].pointHoverBorderColor=hoverBColor;
          
          this.paneDetails[paneSlNo].chartLineBarData[0].fill=false;
          this.paneDetails[paneSlNo].isLiveData=false;
          this.paneDetails[paneSlNo].chartReady=true; 
          console.log('ttt', this.paneDetails[paneSlNo].chartLineBarData[0]); 
      
      })
      .catch(res=>
        {
          Swal.fire('Error!', 'Error occured during Line-Bar chart Data Processing.\n Error: '+JSON.stringify(res), 'error');
        });
           
    
  }

  getDeviceDataPie=async(id:number,paneSlNo:number,paramname:string)=>{
    var xaxisvalue:string[]=[];
    var yaxisvalue:number[]=[]; 
    var paramvalue1:string[]=[];
    
    
    const promise=await this.iotdataservice.getDeviceData(id).toPromise().then(data=>
    {
      this.dashboarddatas=data;
      this.paneDetails[paneSlNo].chartLabels=xaxisvalue;
      this.paneDetails[paneSlNo].chartPieData = [
        { data: [], label: '' },
      ];
            
      for(let data1 of this.dashboarddatas)
      {
       
         var param= JSON.stringify(data1.content).replace("{","").replace("}","").split(',');
         
          for(var i=0;i<param.length;i++)
            {
              var paramValue=param[i].split(':');
              if(paramValue[0]=='"'+paramname+'"')
              paramvalue1.push(paramValue[1]);
            }
            
        } 
        for(var i=0,k=0;i<paramvalue1.length;i++)
        {
          if(paramvalue1[i]!="")
          { 
            xaxisvalue[k]=paramvalue1[i];
            
            var count=1;
            for(var j=i+1;j<paramvalue1.length;j++)
            { 
                if(xaxisvalue[k]==paramvalue1[j])
                {
                  paramvalue1[j]="";
                  count++;
                }
              
            }
            yaxisvalue[k]=count;
            k++;
          }
        }
        this.paneDetails[paneSlNo].chartPieData[0].data=yaxisvalue;
        this.paneDetails[paneSlNo].chartPieData[0].label=paramname;
        this.paneDetails[paneSlNo].chartLabels=xaxisvalue;
        this.paneDetails[paneSlNo].isLiveData=false;
        this.paneDetails[paneSlNo].chartReady=true;  
    
    })
    .catch(res=>
      {
        Swal.fire('Error!', 'Error occured during Pie chart Data Processing.\n Error: '+JSON.stringify(res), 'error');
          
      });
   
      
  
}

getDeviceDataLiveData=async(id:number,paneSlNo:number,paramname:string[])=>{
 
 
  const promise=await this.iotdataservice.getDeviceData(id).toPromise().then(data=>
  {
    this.dashboarddatas=data;
    this.paneDetails[paneSlNo].liveDataLabel = [];
    
       var param= JSON.stringify(this.dashboarddatas[0].content).replace("{","").replace("}","").split(',');
      
        for(var i=0;i<param.length;i++)
          {
            var paramValue=param[i].split(':');
            for(var j=0;j<paramname.length;j++)
            {
              if(paramValue[0]=='"'+paramname[j]+'"')
                {
                 this.paneDetails[paneSlNo].liveDataLabel.push({caption:paramValue[0].replace("\"","").replace("\"",""),value:paramValue[1].replace("\"","").replace("\"","")});
                }
            } 
            
          }
          this.paneDetails[paneSlNo].liveDataLabel.push({caption:"Time",value:new Date(this.dashboarddatas[0].ptime).toLocaleString()});
          this.paneDetails[paneSlNo].isLiveData=true;  
          this.paneDetails[paneSlNo].chartReady=true;  
 
  })
  .catch(res=>
    {
      Swal.fire('Error!', 'Error occured during Live Data Processing.\n Error: '+JSON.stringify(res), 'error');
    });
 
    

}

getDeviceDataGauge=async(id:number,paneSlNo:number,lowmidhighalert:number[],gaugeattribute:string)=>{
  var xaxisvalue:string[]=[];
  var chartlabels:string[]=['Low','Medium','High']; 
  var attrValue:number=0;
  
  var colattr:string="#191717";//attrvalue
  var colalert:string="#FF3333";//alert
  var collow:string="#AEC7F4";//low
  var colmid:string="#5992F9";//mid
  var colhigh:string="#0A5FF9";//high
  var col2:string="#FFFFFF";

  
  
  const promise=await this.iotdataservice.getDeviceData(id).toPromise().then(data=>
  {
    this.dashboarddatas=data;
    this.paneDetails[paneSlNo].chartLabels=xaxisvalue;
    this.paneDetails[paneSlNo].chartGaugeData = [
      { data: [], backgroundColor: [],
      borderWidth: 0,
      hoverBackgroundColor: [],
      hoverBorderWidth: 0},
      {data: [], backgroundColor: [],
      borderWidth: 0,
      hoverBackgroundColor: [],
      hoverBorderWidth: 0}
      ];
      
          
      var param= JSON.stringify(this.dashboarddatas[0].content).replace("{","").replace("}","").split(',');
       
      for(var i=0;i<param.length;i++)
        {
          var paramValue=param[i].split(':');
          
            if(paramValue[0]=='"'+gaugeattribute+'"')
              {
                attrValue=Number(paramValue[1].replace("\"","").replace("\"",""));
                  break;          
              }
                    
        }
        var color1:string[]=[];
        var color2:string[]=[];
        var lowValue=lowmidhighalert[0];
        var midValue=lowmidhighalert[1];
        var highValue=lowmidhighalert[2];
        var alertValue=lowmidhighalert[3];
     if(attrValue==alertValue)
     {
       var values:number[]=[];
       if(attrValue==0)
       {
        values=[1,0.5,lowValue-1.5,midValue-lowValue,highValue-midValue];
        color1= [colattr,colalert,collow,colmid,colhigh];
        color2= [colattr,col2,col2,col2,col2];
       }
       else if(attrValue<lowValue)
       {
        values=[attrValue-1,1,0.5,lowValue-(attrValue+0.5),midValue-lowValue,highValue-midValue];
        color1= [collow,colattr,colalert,collow,colmid,colhigh];
        color2= [col2,colattr,col2,col2,col2,col2];
       }
       else if(attrValue==lowValue)
       {
        values=[lowValue,1,0.5,midValue-(lowValue+1.5),highValue-midValue];
        color1= [collow,colattr,colalert,colmid,colhigh];
        color2= [col2,colattr,col2,col2,col2];
       }
       else if(attrValue>lowValue && attrValue<midValue)
       {
        values=[lowValue,(attrValue-1)-lowValue,1,0.5,midValue-(attrValue+0.5),highValue-midValue];
        color1= [collow,colmid,colattr,colalert,colmid,colhigh];
        color2= [col2,col2,colattr,col2,col2,col2];
       }
       else if(attrValue==midValue)
       {
        values=[lowValue,midValue-lowValue,1,0.5,highValue-(midValue+1.5)];
        color1= [collow,colmid,colattr,colalert,colhigh];
        color2= [col2,col2,colattr,col2,col2]
       }
       else if(attrValue>midValue && attrValue<highValue)
       {
        values=[lowValue,midValue-lowValue,(attrValue-1)-midValue,1,0.5,highValue-(attrValue+0.5)];
        color1= [collow,colmid,colhigh,colattr,colalert,colhigh];
        color2= [col2,col2,col2,colattr,col2,col2]
       }
       else if(attrValue>=highValue)
       {
        values=[lowValue,midValue-lowValue,highValue-midValue,1,0.5];
        color1= [collow,colmid,colhigh,colattr,colalert];
        color2= [col2,col2,col2,colattr,col2];
       }

     }
     else if(attrValue>alertValue)
     {
       var values:number[]=[];
       if(alertValue==0)
       {
          if(attrValue<lowValue)
          {
            values=[0.5,attrValue-0.5,1,lowValue-(attrValue+1),midValue-lowValue,highValue-(midValue)];
            color1= [colalert,collow,colattr,collow,colmid,colhigh];
            color2= [col2,col2,colattr,col2,col2,col2];
          }
          else if(attrValue==lowValue)
          {
            values=[0.5,lowValue-1.5,1,midValue-lowValue,highValue-(midValue)];
            color1= [colalert,collow,colattr,colmid,colhigh];
            color2= [col2,col2,colattr,col2,col2];
          }
          else if(attrValue>lowValue && attrValue<midValue)
          {
            values= [0.5,lowValue-0.5,attrValue-lowValue,1,midValue-(attrValue+1),highValue-(midValue)];
            color1= [colalert,collow,colmid,colattr,colmid,colhigh];
            color2= [col2,col2,col2,colattr,col2,col2];
          }
          else if(attrValue==midValue)
          {
            values= [0.5,lowValue-0.5,midValue-(lowValue-1),1,highValue-(midValue)];
            color1= [colalert,collow,colmid,colattr,colhigh];
            color2= [col2,col2,col2,colattr,col2];
          }
          else if(attrValue>midValue && attrValue<highValue)
          {
            values= [0.5,lowValue-0.5,midValue-(lowValue-0.5),attrValue-midValue,1,highValue-(attrValue+1)];
            color1= [colalert,collow,colmid,colhigh,colattr,colhigh];
            color2= [col2,col2,col2,col2,colattr,col2];
          }
          else if(attrValue>=highValue)
          { 
            values= [0.5,lowValue-0.5,midValue-(lowValue+0.5),highValue-(midValue-1),1];
            color1= [colalert,collow,colmid,colhigh,colattr];
            color2= [col2,col2,col2,col2,colattr];
          }
   
       }
       else if(alertValue<lowValue)
       {
        if(attrValue<lowValue)
        {
          values=[alertValue,0.5,attrValue-(alertValue+0.5),1,lowValue-attrValue,midValue-lowValue,highValue-(midValue)];
          color1= [collow,colalert,collow,colattr,collow,colmid,colhigh];
          color2= [col2,col2,col2,colattr,col2,col2,col2];
        }
        else if(attrValue==lowValue)
        {
          values=[alertValue,0.5,lowValue-(alertValue-1),1,midValue-lowValue,highValue-(midValue)];
            color1= [collow,colalert,collow,colattr,colmid,colhigh];
            color2= [col2,col2,col2,colattr,col2,col2];
        }
        else if(attrValue>lowValue && attrValue<midValue)
        {
          values= [alertValue,0.5,(lowValue-alertValue+0.5),attrValue-lowValue,1,midValue-(attrValue+1),highValue-(midValue)];
            color1= [collow,colalert,collow,colmid,colattr,colmid,colhigh];
            color2= [col2,col2,col2,col2,colattr,col2,col2];
        }
        else if(attrValue==midValue)
        {
          values= [alertValue,0.5,lowValue-(alertValue+0.5),midValue-(lowValue),1,highValue-(midValue)];
            color1= [collow,colalert,collow,colmid,colattr,colhigh];
            color2= [col2,col2,col2,col2,colattr,col2];
        }
        else if(attrValue>midValue && attrValue<highValue)
        {
          values= [alertValue,0.5,lowValue-(alertValue+0.5),midValue-(lowValue),attrValue-midValue,1,highValue-(attrValue+1)];
            color1= [collow,colalert,collow,colmid,colhigh,colattr,colhigh];
            color2= [col2,col2,col2,col2,col2,colattr,col2];
        }
        else if(attrValue>=highValue)
        {
          values= [alertValue,0.5,lowValue-(alertValue+0.5),midValue-(lowValue),highValue-(midValue-1),1];
            color1= [collow,colalert,collow,colmid,colhigh,colattr];
            color2= [col2,col2,col2,col2,col2,colattr];
        }
       }
       else if(alertValue==lowValue)
       {
        
        if(attrValue>lowValue && attrValue<midValue)
        {
          values= [lowValue-0.5,0.5,attrValue-lowValue,1,midValue-(attrValue+1),highValue-(midValue)];
            color1= [collow,colalert,colmid,colattr,colmid,colhigh];
            color2= [col2,col2,col2,colattr,col2,col2];
        }
        else if(attrValue==midValue)
        {
          values= [lowValue-0.5,0.5,midValue-(lowValue+1),1,highValue-(midValue)];
          color1= [collow,colalert,colmid,colattr,colhigh];
          color2= [col2,col2,col2,colattr,col2];
        }
        else if(attrValue>midValue && attrValue<highValue)
        {
          values= [lowValue-0.5,0.5,midValue-(lowValue),attrValue-midValue,1,highValue-(attrValue+1)];
            color1= [collow,colalert,colmid,colhigh,colattr,colhigh];
            color2= [col2,col2,col2,col2,colattr,col2];
        }
        else if(attrValue>=highValue)
        {
          values= [lowValue-0.5,0.5,midValue-(lowValue),highValue-(midValue+1),1];
            color1= [collow,colalert,colmid,colhigh,colattr];
            color2= [col2,col2,col2,col2,colattr];
        }
       }
       else if(alertValue>lowValue && alertValue<midValue)
       {
        if(attrValue>lowValue && attrValue<midValue)
        { values= [lowValue,alertValue-lowValue,0.5,attrValue-(alertValue+0.5),1,midValue-(attrValue+1),highValue-midValue];
          color1= [collow,colmid,colalert,colmid,colattr,collow,colhigh];
          color2= [col2,col2,col2,col2,colattr,col2,col2];
        }
        else if(attrValue==midValue)
        {
          values= [lowValue,alertValue-lowValue,0.5,midValue-(alertValue+1.5),1,highValue-midValue];
          color1= [collow,colmid,colalert,colmid,colattr,colhigh];
          color2= [col2,col2,col2,col2,colattr,col2];
        }
        else if(attrValue>midValue && attrValue<highValue)
        {
            values= [lowValue,alertValue-lowValue,0.5,midValue-(alertValue+0.5),attrValue-midValue,1,highValue-(attrValue+1)];
            color1= [collow,colmid,colalert,colmid,colhigh,colattr,colhigh];
            color2= [col2,col2,col2,col2,col2,colattr,col2];
        }
        else if(attrValue>=highValue)
        {
          values= [lowValue,alertValue-lowValue,0.5,midValue-(alertValue+0.5),highValue-(midValue+1),1];
            color1= [collow,colmid,colalert,colmid,colhigh,colattr];
            color2= [col2,col2,col2,col2,col2,colattr];
        }
       }
       else if(alertValue==midValue)
       {
        if(attrValue>midValue && attrValue<highValue)
        {
          values= [lowValue,midValue-(lowValue+0.5),0.5,attrValue-midValue,1,highValue-(attrValue+1)];
            color1= [collow,colmid,colalert,colhigh,colattr,colhigh];
            color2= [col2,col2,col2,col2,colattr,col2];
        }
        else if(attrValue>=highValue)
        {
          values= [lowValue,midValue-(lowValue+0.5),0.5,highValue-(midValue-1),1];
            color1= [collow,colmid,colalert,colhigh,colattr];
            color2= [col2,col2,col2,col2,colattr];
        }
       }
       else if(alertValue>midValue && alertValue<highValue)
       {
        if(attrValue>midValue && attrValue<highValue)
        {
          values= [lowValue,midValue-(lowValue),alertValue-(midValue+0.5),0.5,attrValue-(alertValue+1),1,highValue-(attrValue)];
            color1= [collow,colmid,colhigh,colalert,colhigh,colattr,colhigh];
            color2= [col2,col2,col2,col2,col2,colattr,col2];
        }
        else if(attrValue>=highValue)
        {
          values= [lowValue,midValue-(lowValue),alertValue-(midValue+0.5),0.5,highValue-(alertValue+1),1];
            color1= [collow,colmid,colhigh,colalert,colhigh,colattr];
            color2= [col2,col2,col2,col2,col2,colattr];
        }
       }
       else if(alertValue>=highValue)
       {
        if(attrValue>=highValue)
        {values= [lowValue,midValue-(lowValue),highValue-(midValue-1.5),0.5,1];
          color1= [collow,colmid,colhigh,colalert,colattr];
          color2= [col2,col2,col2,col2,colattr];
       }
      }

     }
     else
     {
      var values:number[]=[];
      if(attrValue==0)
      {
         if(alertValue<lowValue)
         {
          values=[1,alertValue-1,0.5,lowValue-alertValue,midValue-lowValue,highValue-midValue];
          color1= [colattr,collow,colalert,collow,colmid,colhigh];
          color2= [colattr,col2,col2,col2,col2,col2];
         }
         else if(alertValue==lowValue)
         {
          values=[1,lowValue-1.5,0.5,midValue-lowValue,highValue-midValue];
          color1= [colattr,collow,colalert,colmid,colhigh];
          color2= [colattr,col2,col2,col2,col2];
         }
         else if(alertValue>lowValue && alertValue<midValue)
         {
          values=[1,lowValue-1,alertValue-lowValue,0.5,midValue-(alertValue+0.5),highValue-midValue];
          color1= [colattr,collow,colmid,colalert,colmid,colhigh];
          color2= [colattr,col2,col2,col2,col2,col2];
         }
         else if(alertValue==midValue)
         {
          values=[1,lowValue-1,midValue-(lowValue+0.5),0.5,highValue-midValue];
          color1= [colattr,collow,colmid,colalert,colhigh];
          color2= [colattr,col2,col2,col2,col2];
         }
         else if(alertValue>midValue && alertValue<highValue)
         {
          values=[1,lowValue-1,midValue-lowValue,alertValue-(midValue+0.5),0.5,highValue-alertValue];
          color1= [colattr,collow,colmid,colhigh,colalert,colhigh];
          color2= [colattr,col2,col2,col2,col2,col2];
         }
         else if(alertValue>=highValue)
         {
          
          values=[1,lowValue-1,midValue-lowValue,highValue-(midValue+0.5),0.5];
          color1= [colattr,collow,colmid,colhigh,colalert];
          color2= [colattr,col2,col2,col2,col2];
         }
  
      }
      else if(attrValue<lowValue)
      {
       if(alertValue<lowValue)
       {
        values=[attrValue-lowValue-1,1,alertValue-(attrValue+0.5),0.5,lowValue-alertValue,midValue-lowValue,highValue-midValue];
        color1= [collow,colattr,collow,colalert,collow,colmid,colhigh];
        color2= [col2,colattr,col2,col2,col2,col2,col2];
       }
       else if(alertValue==lowValue)
       {
        values=[attrValue-1,1,lowValue-(attrValue+0.5),0.5,midValue-lowValue,highValue-midValue];
        color1= [collow,colattr,collow,colalert,colmid,colhigh];
        color2= [col2,colattr,col2,col2,col2,col2];
       }
       else if(alertValue>lowValue && alertValue<midValue)
       {
        values=[attrValue-1,1,lowValue-attrValue,alertValue-(lowValue+0.5),0.5,midValue-alertValue,highValue-midValue];
        color1= [collow,colattr,collow,colmid,colalert,colmid,colhigh];
        color2= [col2,colattr,col2,col2,col2,col2,col2];
       }
       else if(alertValue==midValue)
       {
        values=[attrValue-1,1,lowValue-attrValue,midValue-(lowValue+0.5),0.5,highValue-midValue];
        color1= [collow,colattr,collow,colmid,colalert,colhigh];
        color2= [col2,colattr,col2,col2,col2,col2];
       }
       else if(alertValue>midValue && alertValue<highValue)
       {
        values=[attrValue-1,1,lowValue-attrValue,midValue-lowValue,alertValue-(midValue+0.5),0.5,highValue-alertValue];
        color1= [collow,colattr,collow,colmid,colhigh,colalert,colhigh];
        color2= [col2,colattr,col2,col2,col2,col2,col2];
       }
       else if(alertValue>=highValue)
       {
        values=[attrValue-1,1,lowValue-attrValue,midValue-lowValue,highValue-(midValue-0.5),0.5];
        color1= [collow,colattr,collow,colmid,colhigh,colalert];
        color2= [col2,colattr,col2,col2,col2,col2];
       }
      }
      else if(attrValue==lowValue)
      {
       if(alertValue>lowValue && alertValue<midValue)
       {
        values=[lowValue-1,1,alertValue-(lowValue+0.5),0.5,midValue-alertValue,highValue-midValue];
        color1= [collow,colattr,colmid,colalert,colmid,colhigh];
        color2= [col2,colattr,col2,col2,col2,col2];
       }
       else if(alertValue==midValue)
       {
        values=[lowValue-1,1,midValue-(lowValue+0.5),0.5,highValue-midValue];
        color1= [collow,colattr,colmid,colalert,colhigh];
        color2= [col2,colattr,col2,col2,col2];
       }
       else if(alertValue>midValue && alertValue<highValue)
       {
        values=[lowValue-1,1,midValue-lowValue,alertValue-(midValue+0.5),0.5,highValue-alertValue];
        color1= [collow,colattr,colmid,colhigh,colalert,colhigh];
        color2= [col2,colattr,col2,col2,col2,col2];
       }
       else if(alertValue>=highValue)
       {
        values=[lowValue-1,1,midValue-lowValue,highValue-(midValue+0.5),0.5];
        color1= [collow,colattr,colmid,colhigh,colalert];
        color2= [col2,colattr,col2,col2,col2];
       }
      }
      else if(attrValue>lowValue && attrValue<midValue)
      {
       if(alertValue>lowValue && alertValue<midValue)
       {
        values=[lowValue,attrValue-(lowValue+1),1,alertValue-(attrValue+0.5),0.5,midValue-alertValue,highValue-midValue];
        color1= [collow,colmid,colattr,colmid,colalert,colmid,colhigh];
        color2= [col2,col2,colattr,col2,col2,col2,col2];
       }
       else if(alertValue==midValue)
       {
        values=[lowValue,attrValue-(lowValue+1),1,midValue-(attrValue+0.5),0.5,highValue-midValue];
        color1= [collow,colmid,colattr,colmid,colalert,colhigh];
        color2= [col2,col2,colattr,col2,col2,col2];
       }
       else if(alertValue>midValue && alertValue<highValue)
       {
        values=[lowValue,attrValue-(lowValue+1),1,midValue-attrValue,alertValue-(midValue+0.5),0.5,highValue-alertValue];
        color1= [collow,colmid,colattr,colmid,colhigh,colalert,colhigh];
        color2= [col2,col2,colattr,col2,col2,col2,col2];
       }
       else if(alertValue>=highValue)
       {
        values=[lowValue,attrValue-(lowValue+1),1,midValue-attrValue,highValue-(midValue+0.5),0.5];
        color1= [collow,colmid,colattr,colmid,colhigh,colalert];
        color2= [col2,col2,colattr,col2,col2,col2];
       }
      }
      else if(attrValue==midValue)
      {
       if(alertValue>midValue && alertValue<highValue)
       {
        values=[lowValue,midValue-(lowValue+1),1,alertValue-(midValue+0.5),0.5,highValue-alertValue];
        color1= [collow,colmid,colattr,colhigh,colalert,colhigh];
        color2= [col2,col2,colattr,col2,col2,col2];
       }
       else if(alertValue>=highValue)
       {
        values=[lowValue,midValue-(lowValue+1),1,highValue-(midValue+0.5),0.5];
        color1= [collow,colmid,colattr,colhigh,colalert];
        color2= [col2,col2,colattr,col2,col2];
       }
      }
      else if(attrValue>midValue && attrValue<highValue)
      {
       if(alertValue>midValue && alertValue<highValue)
       {
        values=[lowValue,midValue-lowValue,attrValue-(midValue+1),1,alertValue-(attrValue+0.5),0.5,highValue-alertValue];
        color1= [collow,colmid,colhigh,colattr,colhigh,colalert,colhigh];
        color2= [col2,col2,col2,colattr,col2,col2,col2];
       }
       else if(alertValue>=highValue)
       {
        values=[lowValue,midValue-lowValue,attrValue-(midValue+1),1,highValue-(attrValue+0.5),0.5];
        color1= [collow,colmid,colhigh,colattr,colhigh,colalert];
        color2= [col2,col2,col2,colattr,col2,col2];
       }
      }
      else if(attrValue>=highValue)
      {
       if(alertValue>=highValue)
       {
        values=[lowValue,midValue-lowValue,(highValue-midValue+1.5),0.5,1];
        color1= [collow,colmid,colhigh,colalert,colattr];
        color2= [col2,col2,col2,col2,colattr];
       }
      }

     }
     this.paneDetails[paneSlNo].chartGaugeData[0].data=values;
     this.paneDetails[paneSlNo].chartGaugeData[1].data=values;
     this.paneDetails[paneSlNo].chartGaugeData[0].backgroundColor=color1;
     this.paneDetails[paneSlNo].chartGaugeData[0].hoverBackgroundColor=color1;
     this.paneDetails[paneSlNo].chartGaugeData[1].backgroundColor=color2;
     this.paneDetails[paneSlNo].chartGaugeData[1].hoverBackgroundColor=color2;
     this.paneDetails[paneSlNo].chartLabels=chartlabels;
     this.gaugeOptions.title.text=gaugeattribute+" : "+attrValue.toString() + "\n, Alert : "+ alertValue.toString()+ "\n, Low : "+ lowValue.toString()+ "\n, Mid : "+ midValue.toString()+ "\n, High : "+ highValue.toString();
     this.paneDetails[paneSlNo].isLiveData=false;
     this.paneDetails[paneSlNo].chartReady=true;  

      

  
  })
  .catch(res=>
    {
      Swal.fire('Error!', 'Error occured during Gauge chart Data Processing.\n Error: '+JSON.stringify(res), 'error');
    });
    

}

drop(event: CdkDragDrop<any[]>, destRowIndex: number){
  
 const temp = this.paneDetails[event.item.data.index];
 this.paneDetails[event.item.data.index] = this.paneDetails[destRowIndex];
 this.paneDetails[destRowIndex] = temp;
 this.paneDetails.forEach((x, i) => x.index = i);
}

resize(paneid:number, size:string){
 for(var i=0;i<this.paneDetails.length;i++)
 {
   if(this.paneDetails[i].paneId==paneid)
   {
     if(size=='small')
     {
       this.paneDetails[i].size="small"; 
       this.paneDetails[i].cssClass="col-md-4"; 
        
    }
    else if(size=='mid')
    {
      this.paneDetails[i].size="mid"; 
      this.paneDetails[i].cssClass="col-md-8"; 
       
    }
    else
    {
      this.paneDetails[i].size="large"; 
      this.paneDetails[i].cssClass="col-md-12"; 
      
    }
   
     break; 
   }
 }
 this.updatePane(); 
 }

 updatePane=async()=>{
   for(var i=0;i<this.paneDetails.length;i++)
   {
     this.panedetailsUpdate.PaneId=this.paneDetails[i].paneId;
     this.panedetailsUpdate.Index=this.paneDetails[i].index;
     this.panedetailsUpdate.Size=this.paneDetails[i].size;
     const promise=await this.deviceservice.updatePanelDetails(this.panedetailsUpdate).toPromise().then(data=>
    {
    })
    .catch(res=>
    {
     // Swal.fire('Error!', 'Error occured during saving Dashboard Detail.\n Error: '+JSON.stringify(res), 'error');
    });
  }
  // Swal.fire('Success!', 'Dashboard configuration saved successfully.', 'success');
  this.ngOnInit();
  
  }


removePane=async(pane:PaneDetailsFetch)=>{
  Swal.fire({
    title: 'Do you want to remove Pane?',
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: `Remove`,
    denyButtonText: `Cancel`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      this.panedetailsRemove.PaneId=pane.paneId;
      this.panedetailsRemove.DeviceId=pane.deviceId;
      this.panedetailsRemove.DeviceName=pane.deviceName;
      this.panedetailsRemove.Index=pane.index;
      this.panedetailsRemove.Size=pane.size;
    
    
      const promise=this.deviceservice.deletePanelDetails(this.panedetailsRemove).toPromise().then(data=>
        {
          Swal.fire('Success!', 'Pane deleted successfully.', 'success');
          
          var removepos=-1;
          for(var i=0;i<this.paneDetails.length;i++)
          {
            if(this.paneDetails[i].paneId==pane.paneId)
            {
              removepos=i;
              break;
            }
    
          }
          if(removepos>=0)
          this.paneDetails.splice(removepos,1);
        })
        .catch(res=>
        {
          Swal.fire('Error!','Error occured during deleting Pane.\n Error: '+JSON.stringify(res), 'error');
          
        }
        );
    } 
  })
  
   
 }
getCurrentLocationData=async(id:number,paneSlNo:number,latParam:string,longParam:string)=>{
  this.paneDetails[paneSlNo].currentLocLat=0;
  this.paneDetails[paneSlNo].currentLocLong=0;

  const promise=await this.iotdataservice.getDeviceData(id).toPromise().then(data=>
  {  this.dashboarddatas=data;
     var param= JSON.stringify(this.dashboarddatas[0].content).replace("{","").replace("}","").split(',');
      
        for(var i=0;i<param.length;i++)
          {
            var paramValue=param[i].split(':');
            
              if(paramValue[0]=='"'+latParam+'"')
                this.paneDetails[paneSlNo].currentLocLat=Number(paramValue[1].replace("\"","").replace("\"",""));
              else if(paramValue[0]=='"'+longParam+'"')
                this.paneDetails[paneSlNo].currentLocLong=Number(paramValue[1].replace("\"","").replace("\"",""));
             
          }
     this.paneDetails[paneSlNo].isMap=true;  
     this.paneDetails[paneSlNo].mapType='CurrentLocation';
     this.paneDetails[paneSlNo].chartReady=true;  
 
  })
  .catch(res=>
    {
      Swal.fire('Error!', 'Error occured during Current Location Data Processing.\n Error: '+JSON.stringify(res), 'error');
    });
 
    

}

 getRouteMapData=async(id:number,paneSlNo:number,latParam:string,longParam:string)=>{
  this.paneDetails[paneSlNo].routeMap= [
   
  ];
  const promise=await this.iotdataservice.getDeviceData(id).toPromise().then(data=>
  {
    var latValue=[],longValue=[];
    this.dashboarddatas=data;
    for(let data1 of this.dashboarddatas)
      {
        var param= JSON.stringify(data1.content).replace("{","").replace("}","").split(',');
      
        for(var i=0;i<param.length;i++)
          {
            var paramValue=param[i].split(':');
            
              if(paramValue[0]=='"'+latParam+'"')
                latValue.push(Number(paramValue[1].replace("\"","").replace("\"","")));
              else if(paramValue[0]=='"'+longParam+'"')
                 longValue.push(Number(paramValue[1].replace("\"","").replace("\"","")));
               
             
          }
          
      }
      for(var i=0;i<latValue.length-2;i++)
      this.paneDetails[paneSlNo].routeMap.push({origin:{lat:latValue[i],lng:longValue[i]},dest:{lat:latValue[i+1],lng:longValue[i+1]}});
     this.paneDetails[paneSlNo].isMap=true;  
     this.paneDetails[paneSlNo].mapType='RouteMap';
     this.paneDetails[paneSlNo].chartReady=true;  
 
  })
  .catch(res=>
    {
      Swal.fire('Error!', 'Error occured during Route Map Data Processing.\n Error: '+JSON.stringify(res), 'error');
    });
 
    

}
}