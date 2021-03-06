import { Component } from '@angular/core';
import { Router , NavigationStart } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'iot-web';
  showHead: boolean = false;
  constructor(private router: Router) {
    // on route change to '/login', set the variable showHead to false
      router.events.forEach((event) => {
        if (event instanceof NavigationStart) {
          
          if (event['url'] == '/dashboard'||event['url'] == '/updateuser') {
            this.showHead = true;
          } else {
            // console.log("NU")
            this.showHead = false;
          }
        }
      });
    }
}
