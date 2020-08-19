/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StartPageComponent } from './start-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { Model } from 'src/app/models/model';

class RouterStub {
  navigate(path: string[]) {
  }
}

class ResolverData{
  constructor(public result: Array<Model>){
  }
  get data(){
    return this.result;
  }
}

class ActivatedRouteStub {
  result = new Observable<any>();
  get data(){
    return this.result;
  }
  setValue(resolverData:ResolverData){
    this.result = of(resolverData);
  }
  setError(){
    this.result = throwError('err');
  }
}

describe('StartPageComponent', () => {
  let component: StartPageComponent;
  let fixture: ComponentFixture<StartPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartPageComponent ], 
      imports: [ ],
      providers: [
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useClass: ActivatedRouteStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data in resolver',()=>{
    let route = TestBed.get(ActivatedRoute);
    let resolverData = new ResolverData([new Model(1,'Test1'), new Model(2,'Test2')]);
    (route as ActivatedRouteStub).setValue(resolverData);
    component.ngOnInit();

    expect(component.startData).toEqual(resolverData.data);
  })

  it('should navigate to error page if resolver return error',()=>{
    let route = TestBed.get(ActivatedRoute);
    let router = TestBed.get(Router);
    (route as ActivatedRouteStub).setError();
    let routerNavigate = spyOn(router, 'navigate');
    component.ngOnInit();

    expect(routerNavigate).toHaveBeenCalledWith(['/error']);
  })
});
