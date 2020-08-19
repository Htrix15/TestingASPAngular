import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from '../services/data.service';
import {catchError} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Model } from '../models/model';


@Injectable()
export class StartPageResolver implements Resolve<Observable<HttpErrorResponse | Array<Model>>> {

    constructor(private dataService:DataService){
    }

    resolve(): Observable<HttpErrorResponse | Array<Model>>
    {
        return this.dataService.getUserDatas<Array<Model>>('start-page', new Map<string, string>().set('count','1'))
        .pipe(
           catchError(err => of(err))
        )
    }
}