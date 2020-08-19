import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from 'src/app/models/model';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  startData:Array<Model>;
  private mainSubscribe: Subscription;
  
  constructor(private route: ActivatedRoute,
    private router: Router) {
    this.startData = new Array<Model>();
   }

  ngOnInit() {
    this.mainSubscribe = this.route.data.subscribe(resolver =>{ 
      if(resolver.data instanceof Array){
        this.startData = resolver.data;
      }
      if(resolver.data instanceof HttpErrorResponse){
        this.router.navigate(['/error']);
      }
    },
    ()=>{
      this.router.navigate(['/error']);
    }
    ); 
  }

  ngOnDestroy(): void {
    if( this.mainSubscribe) { this.mainSubscribe.unsubscribe();}
  }
}
