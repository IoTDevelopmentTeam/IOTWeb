export class UserModel {
    userId:number=0;
    email:string='';
    phoneNo?:number
    userType:number=1;
    password:string='';
    securityQuesId:number=0;
    securityQuesAns:string='';
    inputDate:Date=new Date();
    updateDate?:Date;

}

export class SecurityQuestions{
    questionId:number=0;
    question:string='';
}

export class UserSecurityQuestions{
    securityQuesId:number=0;
    question :string='';
    securityQuesAns:string='';
}
