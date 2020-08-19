/* tslint:disable:no-unused-variable */
import { TestBed} from '@angular/core/testing';
import { DataService } from 'src/app/services/data.service';
import { HttpClient } from '@angular/common/http';
import { EMPTY } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth-service.service';
import { Model } from '../models/model';

describe('DataService', () => {
    let component: DataService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ ],
        imports: [HttpClientTestingModule],
        providers: [AuthService, DataService]
      })
      component = TestBed.get(DataService);
      httpClient = TestBed.inject(HttpClient);
      httpTestingController = TestBed.inject(HttpTestingController);
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should get GET method if call getUserData method', ()=>{
        let spyGet = spyOn(httpClient,'get').and.returnValue(EMPTY);
        component.getUserDatas(null,null).subscribe(()=>{});
        
        expect(spyGet).toHaveBeenCalled();
    })

    it('should get PUT method if call putUserData method', ()=>{
        let spyPut = spyOn(httpClient,'put').and.returnValue(EMPTY);
        component.putUserDatas(null,null).subscribe(()=>{});

        expect(spyPut).toHaveBeenCalled();
    })

    it('should get POST method if call postUserData method', ()=>{
        let spyPost = spyOn(httpClient,'post').and.returnValue(EMPTY);
        component.postUserDatas(null,null).subscribe(()=>{});

        expect(spyPost).toHaveBeenCalled();
    })

    it('should get DEL method if call delUserData method', ()=>{
        let spyDelete = spyOn(httpClient,'delete').and.returnValue(EMPTY);
        component.delUserDatas(null,null).subscribe(()=>{});

        expect(spyDelete).toHaveBeenCalled();
    })

    it('should get PUT method if call putMultipartDatas method', ()=>{
        let spyPut = spyOn(httpClient,'put').and.returnValue(EMPTY);
        component.putMultipartDatas(null,null).subscribe(()=>{});

        expect(spyPut).toHaveBeenCalled();
    })

    it('should get POST method if call postMultipartDatas', ()=>{
        let spyPost = spyOn(httpClient,'post').and.returnValue(EMPTY);
        component.postMultipartDatas(null,null).subscribe(()=>{});

        expect(spyPost).toHaveBeenCalled();
    })

    it('should set queryParams if call getUserData method', ()=>{
        let key = 'key1';
        let value = 'value1';
        let queryParams = new Map<string, string>();
        queryParams.set(key, value);
        component.getUserDatas('test',queryParams).subscribe(()=>{});
        let req = httpTestingController.expectOne(`/api/test?${key}=${value}`);

        expect(req).toBeDefined();
    })

    it('should set queryParams if call delUserDatas method', ()=>{
         let key = 'key1';
         let value = 'value1';
         let queryParams = new Map<string, string>();
         queryParams.set(key, value);
         component.delUserDatas('test',queryParams).subscribe(()=>{});
         let req = httpTestingController.expectOne(`/api/test?${key}=${value}`);

         expect(req).toBeDefined();
    })

    it('should set queryParams if call postMultipartDatas method', ()=>{
        let key = 'key1';
        let value = 'value1';
        let queryParams = new Map<string, string>();
        queryParams.set(key, value);
        component.postMultipartDatas(null, 'test', queryParams).subscribe(()=>{});
        let req = httpTestingController.expectOne(`/api/test?${key}=${value}`);

        expect(req).toBeDefined();
    })

    it('should set queryParams if call putMultipartDatas method', ()=>{
        let key = 'key1';
        let value = 'value1';
        let queryParams = new Map<string, string>();
        queryParams.set(key, value);
        component.putMultipartDatas(null, 'test',queryParams).subscribe(()=>{});
        let req = httpTestingController.expectOne(`/api/test?${key}=${value}`);

        expect(req).toBeDefined();
    })

    it('should adding datas type into URL if call getUserData method', ()=>{
        let dataType = 'test';
        component.getUserDatas(dataType).subscribe(()=>{});
        let req = httpTestingController.expectOne(`/api/${dataType}`);

        expect(req).toBeDefined();
    })

    it('should adding datas type into URL if call putUserDatas method', ()=>{
        let dataType = 'test';
        component.putUserDatas(null, dataType).subscribe(()=>{});
        let req = httpTestingController.expectOne(`/api/${dataType}`);

        expect(req).toBeDefined();
    })

    it('should adding datas type into URL if call postUserDatas method', ()=>{
        let dataType = 'test';
        component.postUserDatas(null, dataType).subscribe(()=>{});
        let req = httpTestingController.expectOne(`/api/${dataType}`);

        expect(req).toBeDefined();
    })

    it('should adding datas type into URL if call delUserDatas method', ()=>{
        let dataType = 'test';
        component.delUserDatas(dataType).subscribe(()=>{});
        let req = httpTestingController.expectOne(`/api/${dataType}`);

        expect(req).toBeDefined();
    })

    it('should adding datas type into URL if call  postMultipartDatas method', ()=>{
        let dataType = 'test';
        component. postMultipartDatas(null, dataType).subscribe(()=>{});
        let req = httpTestingController.expectOne(`/api/${dataType}`);

        expect(req).toBeDefined();
    })

    it('should adding datas type into URL if call putMultipartDatas method', ()=>{
        let dataType = 'test';
        component.putMultipartDatas(null, dataType).subscribe(()=>{});
        let req = httpTestingController.expectOne(`/api/${dataType}`);

        expect(req).toBeDefined();
    })
    
    it('should adding data into requests body if call postUserDatas method', ()=>{
        let data = new Model(1,'2');
        component.postUserDatas(data, 'test').subscribe(()=>{});
        let req = httpTestingController.expectOne('/api/test');

        expect(req.request.body).toEqual(data);
    })

    it('should adding data into requests body if call putUserDatas method', ()=>{
        let data = new Model(1,'2');
        component.putUserDatas(data, 'test').subscribe(()=>{});
        let req = httpTestingController.expectOne('/api/test');

        expect(req.request.body).toEqual(data);
    })

    it('should adding formData into requests body if call postMultipartDatas method', ()=>{
        const formData = new FormData();
        formData.append('formData',new File([], null));
        component.postMultipartDatas(formData, 'test').subscribe(()=>{});
        let req = httpTestingController.expectOne('/api/test');

        expect(req.request.body.formData).not.toBeNull();
    })

    it('should adding formData into requests body if call putMultipartDatas method', ()=>{
        const formData = new FormData();
        formData.append('formData',new File([], null));
        component.putMultipartDatas(formData, 'test').subscribe(()=>{});
        let req = httpTestingController.expectOne('/api/test');

        expect(req.request.body.formData).not.toBeNull();
    })
});