/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { GetErrorsInterceptor } from './get-errors.interceptor';
import { Router } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpHeaders, HttpClient } from '@angular/common/http';
import { MessagesService } from '../services/messages.service';
import { AuthService } from '../services/auth-service.service';
import { MyMessage } from '../services-models/my-message';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

class RouterStub {
  navigate(path: string[]) {
  }
}

class AuthServiceStub {
    logout(){}
}

describe('GetErrorsInterceptor', () => {
  let component: GetErrorsInterceptor;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let messagesService: MessagesService;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ], 
      imports: [HttpClientTestingModule],
      providers: [
        GetErrorsInterceptor,
        MessagesService,
        {provide: AuthService, useClass:  AuthServiceStub},
        {provide: Router, useClass: RouterStub},
        {
          provide: HTTP_INTERCEPTORS,
          useClass: GetErrorsInterceptor,
          multi: true
        }
      ]
    })
    component = TestBed.get(GetErrorsInterceptor)
    messagesService = TestBed.get(MessagesService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    authService = TestBed.get(AuthService);
    router = TestBed.get(Router)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setOKPostMessage if HttpRequest is POST and url there isnt logon', ()=>{
    let spyMessage = spyOn(messagesService, 'setOKPostMessage');
    
    httpClient.post('test',null).subscribe(()=>{});
    const req = httpTestingController.expectOne('test');
    req.flush(null);

    expect(spyMessage).toHaveBeenCalled();
  });

  it('should not call setOKPostMessage if HttpRequest is POST and url there is logon', ()=>{
    let spyMessage = spyOn(messagesService, 'setOKPostMessage');

    httpClient.post('logon',null).subscribe(()=>{});
    const req = httpTestingController.expectOne('logon');
    req.flush(null);
  
    expect(spyMessage).not.toHaveBeenCalled();
  });

  it('should call setOKPutMessage if HttpRequest is PUT', ()=>{
    let spyMessage = spyOn(messagesService, 'setOKPutMessage');
   
    httpClient.put('test',null).subscribe(()=>{});
    const req = httpTestingController.expectOne('test');
    req.flush(null);

    expect(spyMessage).toHaveBeenCalled();
  });

  it('should call setOKDelMessage if HttpRequest is DELETE', ()=>{
    let spyMessage = spyOn(messagesService, 'setOKDelMessage');
    
    httpClient.delete('test').subscribe(()=>{});
    const req = httpTestingController.expectOne('test');
    req.flush(null);

    expect(spyMessage).toHaveBeenCalled();
  });

  it('should call setOKLogoninMessage if url there is logon', ()=>{
    let spyMessage = spyOn(messagesService, 'setOKLogoninMessage');

    httpClient.post('logon',null).subscribe(()=>{});
    const req = httpTestingController.expectOne('logon');
    req.flush(null);

    expect(spyMessage).toHaveBeenCalled();
  });

  it('should call logout and redirect to /admin/logon if headers there is auth key and logoff value', ()=>{
    let spyAuthService = spyOn(authService, 'logout');
    let spyRouter = spyOn(router, 'navigate');

    httpClient.post('test',null).subscribe(()=>{});
    const req = httpTestingController.expectOne('test');
    req.flush(null, {headers:new HttpHeaders({['auth']:'logoff'})})

    expect(spyAuthService).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/admin/logon']);    
  })

  it('should not call logout and redirect to /admin/logon if headers there is not auth key and logoff value', ()=>{
    let spyAuthService = spyOn(authService, 'logout');
    let spyRouter = spyOn(router, 'navigate');

    httpClient.post('test',null).subscribe(()=>{});
    const req = httpTestingController.expectOne('test');
    req.flush(null, {headers:new HttpHeaders({['auth']:''})})

    expect(spyAuthService).not.toHaveBeenCalled();
    expect(spyRouter).not.toHaveBeenCalledWith(['/admin/logon']);    
  })

  it('should call logout and redirect to /admin/logon and set error message '+
  'if get HttpErrorResponse and status = 401 and url there is not check-admin', ()=>{
    let spyAuthService = spyOn(authService, 'logout');
    let spyRouter = spyOn(router, 'navigate');
    let spyMessage = spyOn(messagesService, 'setMessage');

    let message = new MyMessage(true, 'Ошибка авторизации (code: 401)');
     
    httpClient.post('test',null).subscribe(()=>{},()=>{});
    const req = httpTestingController.expectOne('test');
    req.flush(null, {status:401, statusText:'error'})

    expect(spyAuthService).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/admin/logon']);  
    expect(spyMessage).toHaveBeenCalledWith(message);
  })

  it('should call not logout and redirect to /admin/logon and set error message '+
  'if get HttpErrorResponse and status != 401', ()=>{
    let spyAuthService = spyOn(authService, 'logout');
    let spyRouter = spyOn(router, 'navigate');
    let spyMessage = spyOn(messagesService, 'setMessage');

    let message = new MyMessage(true, 'Ошибка авторизации (code: 401)');

    httpClient.post('test',null).subscribe(()=>{},()=>{});
    const req = httpTestingController.expectOne('test');
    req.flush(null, {status:402, statusText:'error'})

    expect(spyAuthService).not.toHaveBeenCalled();
    expect(spyRouter).not.toHaveBeenCalledWith(['/admin/logon']);  
    expect(spyMessage).not.toHaveBeenCalledWith(message);
  })

  it('should not call logout and redirect to /admin/logon and set error message '+
  'if get HttpErrorResponse and status = 401 and url there is check-admin', ()=>{
    let spyAuthService = spyOn(authService, 'logout');
    let spyRouter = spyOn(router, 'navigate');
    let spyMessage = spyOn(messagesService, 'setMessage');

    let message = new MyMessage(true, 'Ошибка авторизации (code: 401)');

    httpClient.post('url_check-admin',null).subscribe(()=>{},()=>{});
    const req = httpTestingController.expectOne('url_check-admin');
    req.flush(null, {status:401, statusText:'error'})

    expect(spyAuthService).not.toHaveBeenCalled();
    expect(spyRouter).not.toHaveBeenCalledWith(['/admin/logon']);  
    expect(spyMessage).not.toHaveBeenCalledWith(message);
  })

  it('shold call setMessage if get HttpErrorResponse and status != 401', ()=>{
    let spyMessage = spyOn(messagesService, 'setMessage');
    let message = new MyMessage(true, 'error (code: 404)');

    httpClient.post('test',null).subscribe(()=>{},()=>{});
    const req = httpTestingController.expectOne('test');
    req.flush(null, {headers:new HttpHeaders({['error']:'error'}), status:404, statusText:'error'})

    expect(spyMessage).toHaveBeenCalledWith(message);
  } )
});