import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MessagesService } from './services/messages.service';
import {RouterTestingModule} from "@angular/router/testing";
import { By } from '@angular/platform-browser';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { MyMessage } from './services-models/my-message';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let messagesService: MessagesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports:[RouterTestingModule],
      providers: [
        MessagesService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    messagesService = TestBed.get(MessagesService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have router-outlet', () =>{
    let routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));

    expect(routerOutlet).not.toBeNull();
  })
  
  it('should have link to logon page', ()=>{
    let debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
    let logonLink = debugElements.find(de => de.properties['href'] === '/admin/logon');

    expect(logonLink).toBeDefined();
  })

  it('should have link to start page and resturt query key', ()=>{
    let debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
    let logonLink = debugElements.find(de => de.properties['href'] === '/?rest=true');

    expect(logonLink).toBeDefined();
  })

  it('should get message info if message was created', ()=>{
    let message = new MyMessage(false, 'message');
    (messagesService as MessagesService).setMessage(message);

    expect(component.textMessage).toBe(message.messageText);
    expect(component.typeMessageError).toBe(message.error);
    expect(component.chechMessage).toBe(true);
  })

  it('should show error message if error message was created', ()=>{
    let message = new MyMessage(true, 'error message');
    (messagesService as MessagesService).setMessage(message);

    fixture.detectChanges();
    let showMessage = fixture.debugElement.query(By.css('.message__error'));
    expect(showMessage).toBeDefined();
  })

  it('should show info message if info message was created', ()=>{
    let message = new MyMessage(false, 'info message');
    (messagesService as MessagesService).setMessage(message);
    fixture.detectChanges();
    let showMessage = fixture.debugElement.query(By.css('.message__not-error'));

    expect(showMessage).toBeDefined();
  })

  it('should show message text if message was created', ()=>{
    let message = new MyMessage(false, 'info message');
    (messagesService as MessagesService).setMessage(message);
    fixture.detectChanges();
    let messageText = (fixture.debugElement.query(By.css('.message__not-error')).nativeElement as HTMLDivElement).innerText;

    expect(messageText).toBe(message.messageText);
  })

});
