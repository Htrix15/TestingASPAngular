/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LogonComponent } from './logon.component';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { of, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LogonComponent', () => {
  let component: LogonComponent;
  let fixture: ComponentFixture<LogonComponent>;
  let authService: AuthService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogonComponent ],
      imports: [  HttpClientTestingModule],
      providers: [AuthService, DataService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.get(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have login and password form variables', ()=>{
    expect('form' in component).toBeTruthy();
  })

  it('should create login and password input when ngOnInit', ()=>{
    component.ngOnInit();

    expect(component.form.contains('login')).toBeTruthy();
    expect(component.form.contains('password')).toBeTruthy();
  })

  it('should set logoffCheck to false if user is admin', () => {
    spyOn(authService, 'checkAdmin').and.returnValue(of(true));
    component.ngOnInit();
    
    expect(component.logoffCheck).toBeFalse();
  })

  it('should set logoffCheck to false if user is not admin and get logout()', () => {
    spyOn(authService, 'checkAdmin').and.returnValue(of(false));
    let spyLogout =  spyOn(authService, 'logout');
    component.ngOnInit();
    
    expect(component.logoffCheck).toBeTrue();
    expect(spyLogout).toHaveBeenCalled();
  })

  it('should set logoffCheck to false if adminService is invalid  and get logout()', () => {
    spyOn(authService, 'checkAdmin').and.returnValue(throwError('err'));
    let spyLogout =  spyOn(authService, 'logout');
    component.ngOnInit();
    
    expect(component.logoffCheck).toBeTrue();
    expect(spyLogout).toHaveBeenCalled();
  })

  it('should get logout authService method, reset form and set logoffCheck to true when click logout button', ()=>{
    let spyLogout =  spyOn(authService, 'logout');
    let spyFormReset = spyOn(component.form, 'reset');
    component.logout();

    expect(component.logoffCheck).toBeTrue();
    expect(spyLogout).toHaveBeenCalled();
    expect(spyFormReset).toHaveBeenCalled();
  })

  it('should set logoffCheck to false if submit correct user login datas', () =>{
    spyOn(authService, 'logon').and.returnValue(of(false));
    component.form.controls['login'].setValue('login');
    component.form.controls['password'].setValue('password');
    component.submit();

    expect(component.logoffCheck).toBeFalse();
  })

  it('sholud get logon method with user datas', ()=>{
    let spyLogon = spyOn(authService, 'logon').and.returnValue(of(true));
    let user = new User('login', 'password'); 
    component.form.controls['login'].setValue(user.login);
    component.form.controls['password'].setValue(user.password);
    component.submit();

    expect(spyLogon).toHaveBeenCalledWith(user);
  })


  it('should set logoffCheck to true if submit incorrect user login datas', () =>{
    spyOn(authService, 'logon').and.returnValue(of(true));
    component.form.controls['login'].setValue('login');
    component.form.controls['password'].setValue('password');
    component.submit();

    expect(component.logoffCheck).toBeTrue();
  })

  it('should to have not been called logon if input incorrect user login datas', () =>{
    let spyLogon = spyOn(authService, 'logon');
    component.form.controls['login'].setValue('');
    component.form.controls['password'].setValue('');
    component.submit();

    expect(spyLogon).not.toHaveBeenCalled();
  })

  it('should have change logon inputs', ()=>{
    let allInputsDebugElements = fixture.debugElement.queryAll(By.css('input'));
    let textsInputs = allInputsDebugElements
      .filter(el => (el.nativeElement as HTMLInputElement).type == 'text' || (el.nativeElement as HTMLInputElement).type == 'password');
    let countControls = 0;
    let actualCountControls = 0;
      for (let key in component.form.controls){
        let inputs= textsInputs
          .filter(el => el.nativeElement.attributes.formcontrolname.value==key)
          if(inputs.length!=0){
            actualCountControls++;
          }
        countControls++;
      }

    expect(countControls).toBe(actualCountControls);
  })

  it('should submit button into logon form',() =>{
    let form = fixture.debugElement.query(By.css('form'));
    let inputs = form.queryAll(By.css('input'));
    let btn = inputs.find(el=>(el.nativeElement as HTMLInputElement).type == "submit");
    
    expect(btn).toBeDefined();
  })

  it('should call submit when click submit button  form', ()=>{
    let spySubmit = spyOn(component, 'submit');
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(spySubmit).toHaveBeenCalled();
  })

  it('should logout div visable be false if admin not logon', ()=>{
    let divLogout = fixture.debugElement.query(By.css('.logout'));

    expect(divLogout).toBeNull();
  })

  it('should logout div visable be true if admin logon', ()=>{
    component.logoffCheck=false;
    fixture.detectChanges();
    let divLogout = fixture.debugElement.query(By.css('.logout'));
    
    expect(divLogout).not.toBeNull();
  })

  it('should click to logoff button get logout method',()=>{
    component.logoffCheck=false;
    let spyLogout = spyOn(component, 'logout');
    fixture.detectChanges();
    fixture.debugElement.query(By.css('button')).triggerEventHandler('click', null);
    fixture.detectChanges();
  
    expect(spyLogout).toHaveBeenCalled();
  })
});
