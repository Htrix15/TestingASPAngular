/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {RouterTestingModule} from "@angular/router/testing";
import { AdminPageComponent } from './admin-page.component';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';

describe('AdminPageComponent', () => {
  let component: AdminPageComponent;
  let fixture: ComponentFixture<AdminPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPageComponent ],
      imports:[RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have router-outlet', () =>{
    let routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));

    expect(routerOutlet).not.toBeNull();
  })
  
  it('should have link to logon page', ()=>{
    let debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
    let logonLink = debugElements.find(de => de.properties['href'] === '/logon');

    expect(logonLink).toBeDefined();
  })

  it('should have link to edit page', ()=>{
    let debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
    let editLink = debugElements.find(de => de.properties['href'] === '/edit');
    
    expect(editLink).toBeDefined();
  })
});
