export class VideoModel {
    content:Videodata = new Videodata();
    thingname:string='';
    ctime:string='';
    ptime:string='';
}

export class Videodata {
    loc:string='';
    temp:number=0;
}

export class VideoModel1 {
    content:Array<{[key: string]: string}>=new Array<{[key: string]: string}>();
    thingname:string='';
    ctime:string='';
    ptime:string='';
}

export interface videoList {
    id: number;
    url: string;
}  