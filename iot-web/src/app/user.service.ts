import { Injectable } from '@angular/core';

import { HttpClient, HttpParams,HttpHandler,HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs/index";
import { UserModel,SecurityQuestions,UserSecurityQuestions,ResetPassword } from './login/user-model';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  user:UserModel=new UserModel();



  // ApiUrl:string='http://localhost:50364/api/User/GetLoginUserDetails';
  // ApiAddUserUrl:string='http://localhost:50364/api/User/AddEditUser';
  // ApiEmailAvailable:string='http://localhost:50364/api/User/EmailExist';
  // ApiSecurityQuestions:string='http://localhost:50364/api/SecurityQuestion/SecurityQuestions';
  // ApiUserSecQues:string='http://localhost:50364/api/SecurityQuestion/UserSecurityQuestion';
  // ApiResetPwdUrl:string='http://localhost:50364/api/User/ResetPassword'

  
  ApiUrl:string='http://52.14.214.29/api/User/GetLoginUserDetails';
  ApiAddUserUrl:string='http://52.14.214.29/api/User/AddEditUser';
  ApiEmailAvailable:string='http://52.14.214.29/api/User/EmailExist';
  ApiSecurityQuestions:string='http://52.14.214.29/api/SecurityQuestion/SecurityQuestions';
  ApiUserSecQues:string='http://52.14.214.29/api/SecurityQuestion/UserSecurityQuestion';
  ApiResetPwdUrl:string='http://52.14.214.29/api/User/ResetPassword'
  
  
  constructor(private http: HttpClient) { }
  
  setUser(User:UserModel){
    this.user=User;
  }
  getUser():UserModel{
    return this.user;
  }

  loginCheck(user:UserModel):Observable<UserModel>{
        return this.http.get<UserModel>(this.ApiUrl+'/'+user.email+'/'+user.password);
        
  }

  scurityQuestions():Observable<SecurityQuestions[]>{
    return this.http.get<SecurityQuestions[]>(this.ApiSecurityQuestions);
    
 }
 userSecurityQuestions(email:string):Observable<UserSecurityQuestions>{
  return this.http.get<UserSecurityQuestions>(this.ApiUserSecQues+"/"+email);
  
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

  CheckEmailAvialable(email:string):Observable<boolean>{
    return this.http.get<boolean>(this.ApiEmailAvailable+'/'+email);
  }

  ResetPassword(resetpassword:ResetPassword):Observable<any>
  {
   const headers = new HttpHeaders()
   headers.set('content-type', 'application/json'); 
   headers.set('Access-Control-Allow-Credentials', 'true'); 
   headers.set('Access-Control-Allow-Origin', '*'); 
   headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS'); 
   headers.set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'); 
    

    return this.http.post<any>(this.ApiResetPwdUrl,resetpassword,{headers});
    
  
  }

}


