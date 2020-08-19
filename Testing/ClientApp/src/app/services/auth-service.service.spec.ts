/* tslint:disable:no-unused-variable */
import { TestBed} from '@angular/core/testing';
import { DataService } from 'src/app/services/data.service';
import { EMPTY, of, throwError } from 'rxjs';
import { AuthService } from './auth-service.service';
import { User } from '../models/user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthService', () => {
    let component: AuthService;
    let dataService: DataService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ ],
        imports: [ HttpClientTestingModule],
        providers: [AuthService, DataService]
      })
      component = TestBed.get(AuthService);
      dataService = TestBed.get(DataService);
    });
  
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should admin is false if call logout', () => {
        spyOn(dataService, 'getUserDatas').and.returnValue(EMPTY);
        component.logout();

        expect(component.getAdminStatus()).toBeFalse();
    });

    it('should admin is true if logon return true', () => {
        spyOn(dataService, 'postUserDatas').and.returnValue(of(true));
        let logoff:boolean;
        component.logon(new User("login", "password")).subscribe((r)=>logoff=r);

        expect(logoff).toBeFalse();
        expect(component.getAdminStatus()).toBeTrue();
    });

    it('should admin is false if logon return error', () => {
        spyOn(dataService, 'postUserDatas').and.returnValue(throwError('error'));
        let logoff:boolean;
        component.logon(new User("login", "password")).subscribe((r)=>logoff=r);
        
        expect(logoff).toBeTrue();
        expect(component.getAdminStatus()).toBeFalse();
    });

    it('should admin is true if checkAdmin return true',() => {
        spyOn(dataService, 'getUserDatas').and.returnValue(of(true));
        let checkAdmin:boolean;
        component.checkAdmin().subscribe((r)=>checkAdmin=r);

        expect(checkAdmin).toBeTrue();
        expect(component.getAdminStatus()).toBeTrue();
    });

    it('should admin is false if checkAdmin return error', () => {
        spyOn(dataService, 'getUserDatas').and.returnValue(throwError('error'));
        let checkAdmin:boolean;
        component.checkAdmin().subscribe((r)=>checkAdmin=r);

        expect(checkAdmin).toBeFalse();
        expect(component.getAdminStatus()).toBeFalse();
    });

    it('should call logout if checkAdmin return error and admin was true', () => {
        let spyLogout = spyOn(component, 'logout');
        spyOn(dataService, 'postUserDatas').and.returnValue(of(true));
        component.logon(new User("login", "password")).subscribe();
        spyOn(dataService, 'getUserDatas').and.returnValue(throwError('error'));
        component.checkAdmin().subscribe();

        expect(spyLogout).toHaveBeenCalled();
    });
});