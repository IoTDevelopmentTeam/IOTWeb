import { Injectable } from '@angular/core';

import { HttpClient, HttpParams,HttpHandler,HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs/index";
import { UserModel } from './login/user-model';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  user:UserModel=new UserModel();
  ApiUrl:string='http://localhost:50364/api/User/GetLoginUserDetails';
  ApiAddUserUrl:string='http://localhost:50364/api/User/AddEditUser';
  constructor(private http: HttpClient) { }
  
  setUser(User:UserModel){
    this.user=User;
  }
  getUser():UserModel{
    return this.user;
  }

  loginCheck(user:UserModel):Observable<UserModel>{
        return this.http.get<UserModel>(this.ApiUrl+'/'+user.userName+'/'+user.password);
    
    
  }

  UserRegistration(user:UserModel):Observable<any>
  {
   const headers = new HttpHeaders()
   headers.set('content-type', 'application/json'); 
   headers.set('Access-Control-Allow-Credentials', 'true'); 
   headers.set('Access-Control-Allow-Origin', '*'); 
   headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS'); 
   headers.set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'); 
    

    return this.http.post<any>(this.ApiAddUserUrl,user,{headers});
    
  
  }

}
