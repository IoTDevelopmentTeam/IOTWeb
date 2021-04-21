import { Component, OnInit, } from '@angular/core';
import { UserModel } from '../login/user-model';
import { videoList } from './video-model';
import { videoLists } from './videoLists';


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['../CSS/light.css'],
})

export class VideoComponent implements OnInit {
  user: UserModel = new UserModel();
  vls = videoLists;
  selectedVideo?: videoList;
  
  ngOnInit(): void {
    const userstring = sessionStorage.getItem('loggedinuser');
    if (userstring != null) {
      const loggedinuser = JSON.parse(userstring);
      this.user = loggedinuser;
      var UserId = this.user.userId;
    }
    //this.filterByCategory('root');
  };  
  
  onSelect(video: videoList): void {
    this.selectedVideo = video;
  }
  
  /* filterByCategory(categoryId){
    this.videoLists = this.cats.filter(cat => cat.parent_id == categoryId)
  } */
}
