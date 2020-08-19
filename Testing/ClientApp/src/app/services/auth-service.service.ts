import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable} from 'rxjs';
import { User } from '../models/user';


@Injectable()
export class AuthService {
    
    private admin:boolean;

    constructor(private dataService: DataService) { 
        this.admin = false;
    }

    logon(user:User):Observable<boolean>{
        return new Observable((observer) => {
            this.dataService.postUserDatas<User, null>(user, "logon").subscribe(
                () =>{
                    this.admin = true;
                    observer.next(false);
                },
                ()=>{observer.next(true);}
              );
        });
    }
    
    logout(){
        this.dataService.getUserDatas("logout", null).subscribe();
        this.admin = false;
    }

    checkAdmin():Observable<boolean>{
        return new Observable((observer) => {
                this.dataService.getUserDatas("check-admin", null).subscribe(
                    () =>{   this.admin = true;  observer.next(true);},
                    () =>{   if(this.admin) {this.logout();}  observer.next(false)}
                )
        });
    }
    
    getAdminStatus():boolean{
        return this.admin;
    }

}
