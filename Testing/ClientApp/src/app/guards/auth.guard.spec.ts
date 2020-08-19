/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { AuthService } from '../services/auth-service.service';
import { MessagesService } from '../services/messages.service';
import { MyMessage } from '../services-models/my-message';

class RouterStub {
    navigate(path: string[]) {
    }
}
class AuthServiceStub{
    result:Observable<any>;
    constructor(){
        this.result = of(false);
    }

    setCheckAdmin(checkAdmin:boolean){
        this.result = of(checkAdmin); 
    }
    setError(){
        this.result = throwError('err');
    }
    checkAdmin():Observable<boolean>
    {
        return this.result;
    }
}

describe('AuthGuard', () => {
  let component: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[],
      providers: [
        {provide: AuthService, useClass: AuthServiceStub},
        MessagesService,
        AuthGuard ,
        {provide: Router, useClass: RouterStub}
      ]
    })
    component = TestBed.get(AuthGuard)

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to logon if user isnt admin', ()=>{
    let router = TestBed.get(Router);
    let routerNavigate = spyOn(router, 'navigate');
    component.canActivate().subscribe();
    expect(routerNavigate).toHaveBeenCalledWith(['/admin/logon']);
  });

  it('should set error message if user isnt admin', ()=>{
    let messagesService = TestBed.get(MessagesService);
    let spyMessage = spyOn(messagesService, 'setMessage')
    let message = new MyMessage(true,"не админам нельзя!");
    component.canActivate().subscribe();
    expect(spyMessage).toHaveBeenCalledWith(message);
  });

  it('should redirect to logon if authServise return error', ()=>{
    let router = TestBed.get(Router);
    let routerNavigate = spyOn(router, 'navigate');
    let authService = TestBed.get(AuthService);
    (authService as AuthServiceStub).setError();
    component.canActivate().subscribe();
    expect(routerNavigate).toHaveBeenCalledWith(['/admin/logon']);
  });

  it('should set error message if authServise return error', ()=>{
    let messagesService = TestBed.get(MessagesService);
    let spyMessage = spyOn(messagesService, 'setMessage')
    let message = new MyMessage(true,"не админам нельзя!");
    let authService = TestBed.get(AuthService);
    (authService as AuthServiceStub).setError();
    component.canActivate().subscribe();
    expect(spyMessage).toHaveBeenCalledWith(message);
  });

  it('should return true if user is admin', ()=>{
    let authService = TestBed.get(AuthService);
    (authService as AuthServiceStub).setCheckAdmin(true);
    let result: boolean;
    component.canActivate().subscribe((checkAdmin)=>result=checkAdmin);
    expect(result).toBeTrue();
  });

});
