/* tslint:disable:no-unused-variable */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StartPageResolver } from './start-page.resolver';
import { TestBed } from '@angular/core/testing';
import { DataService } from '../services/data.service';
import { Model } from '../models/model';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


describe('StartPageResolver', () => {
    let component: StartPageResolver;
    let dataService: DataService;
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ ],
        imports: [ HttpClientTestingModule],
        providers: [StartPageResolver, DataService]
      })
      component = TestBed.get(StartPageResolver);
     dataService = TestBed.get(DataService);
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should return Model if back return Model', ()=>{       
        let data:Array<Model>;
        let model = [new Model(1,"Test")];
        spyOn(dataService, 'getUserDatas').and.returnValue(of(model));
        component.resolve().subscribe((m: Array<Model>)=>data=m);

        expect(data).toEqual(model);
    })

    it('should return error if back return error', ()=>{
        let error ='Error';
        spyOn(dataService, 'getUserDatas').and.returnValue(throwError(error));
        let checkError:HttpErrorResponse;
        component.resolve().subscribe((err:HttpErrorResponse)=>{checkError=err});
        
        expect(checkError).not.toBeUndefined();
    })
    
});