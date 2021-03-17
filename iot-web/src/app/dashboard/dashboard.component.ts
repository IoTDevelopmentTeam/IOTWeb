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
import { async } from '@angular/core/testing';

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { bottom } from '@popperjs/core';



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
              suggestedMin: 0
              
          }
      }]
    }
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
        "text": "4"
        // "position": bottom
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
    this.getDetail(UserId);
    }
    
  }
  getDetail=async(id:number)=>{//(devices:DeviceModel[])=>{
    // for(var i=0;i<devices.length;i++)
    // {
      
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
      if(this.paneDetails[i].size=="small")
       {this.paneDetails[i].cssClass="col-md-4"; 
       this.paneDetails[i].height="255";
        }
      else if(this.paneDetails[i].size=="mid")
       {this.paneDetails[i].cssClass="col-md-8"; 
       this.paneDetails[i].height="120"; 
      }
      else 
        {this.paneDetails[i].cssClass="col-md-12";
        this.paneDetails[i].height="80";
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
      alert('Error occured during Pane Detail fetching.\n Error: '+JSON.stringify(res))});
  } 

  getConfigDetail=async(id:number,paneSlNo:number,deviceId:number)=>{
    const promise=await this.deviceservice.getConfigDetail(id).toPromise().then(res => { // Success
      // alert(JSON.stringify(this.configDetails));
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
        this.getDeviceDataLiveData(deviceId,paneSlNo,paramValue); 
      } 
      else if(this.configDetails[0].masterId==2)
      paneType='line' as ChartType;
      else if(this.configDetails[0].masterId==3)
      paneType='bar' as ChartType;
      else if(this.configDetails[0].masterId==4)
      paneType='pie' as ChartType;
      else if(this.configDetails[0].masterId==5)
      paneType='doughnut' as ChartType;
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
      alert('Error occured during Config Detail fetching.\n Error: '+JSON.stringify(res))});
  } 
  getDeviceDataLineBar=async(id:number,paneSlNo:number,xaxis:string,yaxis:string)=>{
      var xaxisvalue:string[]=[];
      var yaxisvalue:number[]=[]; 
     
      const promise=await this.iotdataservice.getDeviceData(id).toPromise().then(data=>
      {
        this.dashboarddatas=data;
        this.paneDetails[paneSlNo].chartLabels=xaxisvalue;
        this.paneDetails[paneSlNo].chartLineBarData = [
          { data: [], label: '' },
        ];
        var prevDate:string="00/00/0000";    
        for(let data1 of this.dashboarddatas)
        {
         
           var param= JSON.stringify(data1.content).replace("{","").replace("}","").split(',');
           
            for(var i=0;i<param.length;i++)
              {
                var paramValue=param[i].split(':');
                if(paramValue[0]=='"'+xaxis+'"')
                  xaxisvalue.push(paramValue[1]);
                if(paramValue[0]=='"'+yaxis+'"')
                  yaxisvalue.push(Number(paramValue[1].replace("\"","").replace("\"","")));

              }
              if(xaxis=="Time")
              {
                if(new Date(data1.ptime).toLocaleDateString()!=prevDate)
                  xaxisvalue.push(new Date(data1.ptime).toLocaleString());
                else
                  xaxisvalue.push(new Date(data1.ptime).toLocaleTimeString());
                prevDate=new Date(data1.ptime).toLocaleDateString();
              }
         } 
              
          this.paneDetails[paneSlNo].chartLineBarData[0].data=yaxisvalue;
          this.paneDetails[paneSlNo].chartLineBarData[0].label=yaxis;
          this.paneDetails[paneSlNo].isLiveData=false;
          this.paneDetails[paneSlNo].chartReady=true;  
      
      })
      .catch(res=>
        {
            alert('Error occured during Line-Bar chart Data Processing.\n Error: '+JSON.stringify(res))
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
          alert('Error occured during Pie chart Data Processing.\n Error: '+JSON.stringify(res))
      });
   
      
  
}

getDeviceDataLiveData=async(id:number,paneSlNo:number,paramname:string[])=>{
 
 
  const promise=await this.iotdataservice.getDeviceData(id).toPromise().then(data=>
  {
    this.dashboarddatas=data;
    this.paneDetails[paneSlNo].liveDataLabel = [''];
    
       var param= JSON.stringify(this.dashboarddatas[0].content).replace("{","").replace("}","").split(',');
       var k=0;
        for(var i=0;i<param.length;i++)
          {
            var paramValue=param[i].split(':');
            for(var j=0;j<paramname.length;j++)
            {
              if(paramValue[0]=='"'+paramname[j]+'"')
                {
                  this.paneDetails[paneSlNo].liveDataLabel[k]=paramValue[0].replace("\"","").replace("\"","")+" : "+paramValue[1].replace("\"","").replace("\"","");
                 
                  // this.paneDetails[paneSlNo].liveData[k]=livedata;
                  k++;
                  
                }
            } 
            this.paneDetails[paneSlNo].liveDataLabel[k]="Time : "+new Date(this.dashboarddatas[0].ptime).toLocaleString(); 

            
          }
          
          this.paneDetails[paneSlNo].isLiveData=true;  
      this.paneDetails[paneSlNo].chartReady=true;  
 
  })
  .catch(res=>
    {
        alert('Error occured during Live Data Processing.\n Error: '+JSON.stringify(res))
    });
 
    

}

getDeviceDataGauge=async(id:number,paneSlNo:number,lowmidhighalert:number[],gaugeattribute:string)=>{
  var xaxisvalue:string[]=[];
  var chartlabels:string[]=['Low','Medium','High']; 
  var attrValue:number=0;
  
  var colattr:string="#191717";//attrvalue
  var colalert:string="#FF3333";//alert
  var collow:string="#FFFF33";//low
  var colmid:string="#80FF33";//mid
  var colhigh:string="#FF8633";//high
  var col2:string="#FFFFFF";

  lowmidhighalert[3]=0;
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
                attrValue=0;//Number(paramValue[1].replace("\"","").replace("\"",""));
                  break;          
              }
                    
        }
        var color1:string[]=[];
        var color2:string[]=[];
     if(attrValue==lowmidhighalert[3])
     {
       var values:number[]=[];
       if(attrValue==0)
       {
        values=[1,0.5,lowmidhighalert[0]-1.5,lowmidhighalert[1]-lowmidhighalert[0],lowmidhighalert[2]-lowmidhighalert[1]];
        color1= [colattr,colalert,collow,colmid,colhigh];
        color2= [colattr,col2,col2,col2,col2];
       }
       else if(attrValue<lowmidhighalert[0])
       {
        values=[attrValue-1,1,0.5,lowmidhighalert[0]-(attrValue+1.5),lowmidhighalert[1]-lowmidhighalert[0],lowmidhighalert[2]-lowmidhighalert[1]];
        color1= [collow,colattr,colalert,collow,colmid,colhigh];
        color2= [col2,colattr,col2,col2,col2,col2];
       }
       else if(attrValue==lowmidhighalert[0])
       {
        values=[lowmidhighalert[0],1,0.5,lowmidhighalert[1]-(lowmidhighalert[0]+1.5),lowmidhighalert[2]-lowmidhighalert[1]];
        color1= [collow,colattr,colalert,colmid,colhigh];
        color2= [col2,colattr,col2,col2,col2];
       }
       else if(attrValue>lowmidhighalert[0] && attrValue<lowmidhighalert[1])
       {
        values=[lowmidhighalert[0],(attrValue-1)-lowmidhighalert[0],1,0.5,lowmidhighalert[1]-(attrValue+1.5),lowmidhighalert[2]-lowmidhighalert[1]];
        color1= [collow,colmid,colattr,colalert,colmid,colhigh];
        color2= [col2,col2,colattr,col2,col2,col2];
       }
       else if(attrValue==lowmidhighalert[1])
       {
        values=[lowmidhighalert[0],lowmidhighalert[1]-lowmidhighalert[0],1,0.5,lowmidhighalert[2]-(lowmidhighalert[1]+1.5)];
        color1= [collow,colmid,colattr,colalert,colhigh];
        color2= [col2,col2,colattr,col2,col2]
       }
       else if(attrValue>lowmidhighalert[1] && attrValue<lowmidhighalert[2])
       {
        values=[lowmidhighalert[0],lowmidhighalert[1]-lowmidhighalert[0],(attrValue-1)-lowmidhighalert[1],1,0.5,lowmidhighalert[2]-(attrValue+1.5)];
        color1= [collow,colmid,colhigh,colattr,colalert,colhigh];
        color2= [col2,col2,col2,colattr,col2,col2]
       }
       else if(attrValue>=lowmidhighalert[2])
       {
        values=[lowmidhighalert[0],lowmidhighalert[1]-lowmidhighalert[0],lowmidhighalert[2]-lowmidhighalert[1],1,0.5];
        color1= [collow,colmid,colhigh,colattr,colalert];
        color2= [col2,col2,col2,colattr,col2];
       }

     }
     else if(attrValue>lowmidhighalert[3])
     {
       var values:number[]=[];
       if(lowmidhighalert[3]==0)
       {

       }
       else if(lowmidhighalert[3]<lowmidhighalert[0])
       {}
       else if(lowmidhighalert[3]==lowmidhighalert[0])
       {}
       else if(lowmidhighalert[3]>lowmidhighalert[0] && lowmidhighalert[3]<lowmidhighalert[1])
       {}
       else if(lowmidhighalert[3]==lowmidhighalert[1])
       {

       }
       else if(lowmidhighalert[3]>lowmidhighalert[1] && lowmidhighalert[3]<lowmidhighalert[2])
       {}
       else if(lowmidhighalert[3]>=lowmidhighalert[2])
       {}

     }
     else
     {
       var values:number[]=[];
       if(attrValue==0)
       {

       }
       else if(attrValue<lowmidhighalert[0])
       {}
       else if(attrValue==lowmidhighalert[0])
       {}
       else if(attrValue>lowmidhighalert[0] && attrValue<lowmidhighalert[1])
       {}
       else if(attrValue==lowmidhighalert[1])
       {

       }
       else if(attrValue>lowmidhighalert[1] && attrValue<lowmidhighalert[2])
       {}
       else if(attrValue>=lowmidhighalert[2])
       {}

     }
      this.paneDetails[paneSlNo].chartGaugeData[0].data=values;
      this.paneDetails[paneSlNo].chartGaugeData[1].data=values;
      this.paneDetails[paneSlNo].chartGaugeData[0].backgroundColor=color1;
      this.paneDetails[paneSlNo].chartGaugeData[0].hoverBackgroundColor=color1;
      this.paneDetails[paneSlNo].chartGaugeData[1].backgroundColor=color2;
      this.paneDetails[paneSlNo].chartGaugeData[1].hoverBackgroundColor=color2;
      this.paneDetails[paneSlNo].chartLabels=chartlabels;
      this.gaugeOptions.title.text=attrValue.toString();
      this.paneDetails[paneSlNo].isLiveData=false;
      this.paneDetails[paneSlNo].chartReady=true;  

      

  
  })
  .catch(res=>
    {
        alert('Error occured during Gauge chart Data Processing.\n Error: '+JSON.stringify(res))
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
     if(!this.paneDetails[i].isLiveData){
      var canvas = document.getElementById('canvas'+paneid.toString()) as HTMLElement;
      canvas.style.maxHeight ="320px";
      canvas.style.minHeight="320px";
      canvas.style.height="320px";
      canvas.style.lineHeight="320px";
     }
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
    {alert('Error occured during saving Dashboard Detail.\n Error: '+JSON.stringify(res))}
    );
  }
  alert('Dashboard configuration saved successfully.');
  }


removePane=async(pane:PaneDetailsFetch)=>{
  
  this.panedetailsRemove.PaneId=pane.paneId;
  this.panedetailsRemove.DeviceId=pane.deviceId;
  this.panedetailsRemove.DeviceName=pane.deviceName;
  this.panedetailsRemove.Index=pane.index;
  this.panedetailsRemove.Size=pane.size;


  const promise=await this.deviceservice.deletePanelDetails(this.panedetailsRemove).toPromise().then(data=>
    {
      alert('Pane deleted successfully.');
    })
    .catch(res=>
    {alert('Error occured during deleting Pane.\n Error: '+JSON.stringify(res))}
    );
  
 }
}