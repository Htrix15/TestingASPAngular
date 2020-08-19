/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EditUserComponent } from './edit-user.component';
import { DataService } from 'src/app/services/data.service';
import { EMPTY, Subscription } from 'rxjs';
import { ChangeUser } from 'src/app/models/change-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserComponent ],
      imports: [ HttpClientTestingModule],
      providers: [DataService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have login and password forms variables', ()=>{
    expect('formLogin' in component).toBeTruthy();
    expect('formPassword' in component).toBeTruthy();
  })

  it('should create login form there are old and new input when ngOnInit', ()=>{
    component.ngOnInit();
    
    expect(component.formLogin.contains('oldLogin')).toBeTruthy();
    expect(component.formLogin.contains('newLogin')).toBeTruthy();
  })

  it('should create password form there are old and new input when ngOnInit', ()=>{
    component.ngOnInit();

    expect(component.formPassword.contains('oldPassword')).toBeTruthy();
    expect(component.formPassword.contains('newPassword')).toBeTruthy();
  })

  it('should set invalid state if input empty value to old login', ()=>{
    let oldLogin = component.formLogin.get('oldLogin');
    oldLogin.setValue('');

    expect(oldLogin.errors).toEqual({emptyText: true});
  })

  it('should set invalid state if input little value to old login', ()=>{
    let oldLogin = component.formLogin.get('oldLogin');
    let testString = '1';
    oldLogin.setValue(testString);

    expect(oldLogin.errors)
    .toEqual({ minlength: Object({ requiredLength: component?.minLoginLength | 5, actualLength: testString.length }) })
  })

  it('should set invalid state if input bigger value to old login', ()=>{
    let oldLogin = component.formLogin.get('oldLogin');
    let testString = 'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest';
    oldLogin.setValue(testString);
    expect(oldLogin.errors)
    .toEqual({ maxlength: Object({ requiredLength: component?.maxLoginLength | 5, actualLength: testString.length }) })
  })

  it('should set invalid state if input empty value to new login', ()=>{
    let oldLogin = component.formLogin.get('newLogin');
    oldLogin.setValue('');
    expect(oldLogin.errors).toEqual({emptyText: true});
  })

  it('should set invalid state if input little value to new login', ()=>{
    let oldLogin = component.formLogin.get('newLogin');
    let testString = '1';
    oldLogin.setValue(testString);

    expect(oldLogin.errors)
    .toEqual({ minlength: Object({ requiredLength: component?.minLoginLength | 5, actualLength: testString.length }) })
  })

  it('should set invalid state if input bigger value to new login', ()=>{
    let oldLogin = component.formLogin.get('newLogin');
    let testString = 'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest';
    oldLogin.setValue(testString);

    expect(oldLogin.errors)
    .toEqual({ maxlength: Object({ requiredLength: component?.maxLoginLength | 5, actualLength: testString.length }) })
  })

  it('should set invalid state if input empty value to old password', ()=>{
    let oldPassword = component.formPassword.get('oldPassword');
    oldPassword.setValue('');

    expect(oldPassword.errors).toEqual({emptyText: true});
  })

  it('should set invalid state if input little value to old password', ()=>{
    let oldPassword = component.formPassword.get('oldPassword');
    let testString = '1';
    oldPassword.setValue(testString);

    expect(oldPassword.errors)
    .toEqual({ minlength: Object({ requiredLength: component?.minPasswordLength | 5, actualLength: testString.length }) })
  })

  it('should set invalid state if input bigger value to old password', ()=>{
    let oldPassword = component.formPassword.get('oldPassword');
    let testString = 'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest';
    oldPassword.setValue(testString);

    expect(oldPassword.errors)
    .toEqual({ maxlength: Object({ requiredLength: component?.maxPasswordLength | 5, actualLength: testString.length }) })
  })

  it('should set invalid state if input empty value to new password', ()=>{
    let newPassword = component.formPassword.get('newPassword');
    newPassword.setValue('');

    expect(newPassword.errors).toEqual({emptyText: true});
  })

  it('should set invalid state if input little value to new password', ()=>{
    let newPassword = component.formPassword.get('newPassword');
    let testString = '1';
    newPassword.setValue(testString);

    expect(newPassword.errors)
    .toEqual({ minlength: Object({ requiredLength: component?.minPasswordLength | 5, actualLength: testString.length }) })
  })

  it('should set invalid state if input bigger value to new password', ()=>{
    let newPassword = component.formPassword.get('newPassword');
    let testString = 'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest';
    newPassword.setValue(testString);

    expect(newPassword.errors)
    .toEqual({ maxlength: Object({ requiredLength: component?.maxPasswordLength | 5, actualLength: testString.length }) })
  })

  it('should get put method in dataService if call submitLogin', ()=>{
    let dataService = TestBed.get(DataService);
    let spy = spyOn(dataService, 'putUserDatas').and.returnValue(EMPTY);
    let changeUser = new ChangeUser('old', 'new');
    component.formLogin.controls['oldLogin'].setValue(changeUser.oldValue);
    component.formLogin.controls['newLogin'].setValue(changeUser.newValue);
    component.submitLogin();

    expect(spy).toHaveBeenCalledWith(changeUser, "login")
  })

  it('should get put method in dataService if call submitPassword', ()=>{
    let dataService = TestBed.get(DataService);
    let spy = spyOn(dataService, 'putUserDatas').and.returnValue(EMPTY);
    let changeUser = new ChangeUser('old', 'new');
    component.formPassword.controls['oldPassword'].setValue(changeUser.oldValue);
    component.formPassword.controls['newPassword'].setValue(changeUser.newValue);
    component.submitPassword();

    expect(spy).toHaveBeenCalledWith(changeUser, "password")
  })

  it('should call unsubscribe when ngOnDestroy', ()=>{
    component.checkLoginSubscribe = new Subscription();
    component.checkPasswordSubscribe = new Subscription();
    let spyLoginSubscribe = spyOn(component.checkLoginSubscribe, 'unsubscribe');
    let spyPasswordSubscribe = spyOn(component.checkPasswordSubscribe, 'unsubscribe');
    component.ngOnDestroy();

    expect(spyLoginSubscribe).toHaveBeenCalled();
    expect(spyPasswordSubscribe).toHaveBeenCalled();
  })

  it('should have change login inputs', ()=>{
    let allInputsDebugElements = fixture.debugElement.queryAll(By.css('input'));
    let textsInputs = allInputsDebugElements
      .filter(el => (el.nativeElement as HTMLInputElement).type == 'text' || (el.nativeElement as HTMLInputElement).type == 'password');
    let countControls = 0;
    let actualCountControls = 0;
      for (let key in component.formLogin.controls){
        let inputs= textsInputs
          .filter(el => el.nativeElement.attributes.formcontrolname.value==key)
          if(inputs.length!=0){
            actualCountControls++;
          }
        countControls++;
      }

      expect(countControls).toBe(actualCountControls);
  })

  it('should submit button into submitChangeLogin form',() =>{
    let form = fixture.debugElement.query(By.css('#submitChangeLogin'));
    let inputs = form.queryAll(By.css('input'));
    let btn = inputs.find(el=>(el.nativeElement as HTMLInputElement).type == "submit");

    expect(btn).toBeDefined();
  })

  it('should call submitLogin when click button in submitChangeLogin form', ()=>{
    let spySubmitLogin = spyOn(component, 'submitLogin');
    fixture.debugElement.query(By.css('#submitChangeLogin')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(spySubmitLogin).toHaveBeenCalled();
  })

  it('should submit button into submitChangePassword form',() =>{
    let form = fixture.debugElement.query(By.css('#submitChangePassword'));
    let inputs = form.queryAll(By.css('input'));
    let btn = inputs.find(el=>(el.nativeElement as HTMLInputElement).type == "submit");

    expect(btn).toBeDefined();
  })

  it('should call submitPassword when click button submitChangePassword form', ()=>{
    let spySubmitPassword = spyOn(component, 'submitPassword');
    fixture.debugElement.query(By.css('#submitChangePassword')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(spySubmitPassword).toHaveBeenCalled();
  })

  it('should have change password inputs', ()=>{
    let allInputsDebugElements = fixture.debugElement.queryAll(By.css('input'));
    let textsInputs = allInputsDebugElements
      .filter(el => (el.nativeElement as HTMLInputElement).type == 'text' || (el.nativeElement as HTMLInputElement).type == 'password');
    let countControls = 0;
    let actualCountControls = 0;
      for (let key in component.formPassword.controls){
        let inputs = textsInputs
          .filter(el => el.nativeElement.attributes.formcontrolname.value==key)
          if(inputs.length!=0){
            actualCountControls++;
          }
        countControls++;
      }

      expect(countControls).toBe(actualCountControls);
  })
  
});
