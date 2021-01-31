import { Injectable } from '@angular/core';

import { HttpClient, HttpParams,HttpHandler} from '@angular/common/http';
import {Observable} from "rxjs/index";
import { UserModel } from './login/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user:UserModel=new UserModel();
  ApiUrl:string='http://localhost:50364/api/User/GetLoginUserDetails';
  constructor(private http: HttpClient) { }
  
  setUser(User:UserModel){
    this.user=User;
  }
  getUser():UserModel{
    return this.user;
  }

  loginCheck(UserId:string,pwd:string):Observable<UserModel>{
        return this.http.get<UserModel>(this.ApiUrl+'/'+UserId+'/'+pwd);
      
    
  }

}
