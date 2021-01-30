import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {

  x:string ='';
  constructor() { }

  ngOnInit(): void {
  }

  getValue()
  {
    alert(this.x);
  }

}
