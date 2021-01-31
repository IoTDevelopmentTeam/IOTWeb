export class UserModel {
    userId:number=0;
    userName:string='';
    email:string='';
    phoneNo?:number
    userType:number=1;
    password:string='';
    inputDate:Date=new Date();
    updateDate?:Date;

}
