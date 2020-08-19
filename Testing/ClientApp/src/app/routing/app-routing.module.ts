import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartPageResolver } from '../resolvers/start-page.resolver';
import { StartPageComponent } from '../pages/start-page/start-page.component';
import { ErrorPageComponent } from '../pages/error-page/error-page.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
    {
        path: '',  runGuardsAndResolvers: "paramsOrQueryParamsChange",  children:[
            {
                path: '', component: StartPageComponent
            },
            {
                path: 'admin', loadChildren: () => import('./admin-routing.module').then(mod => mod.AdminRoutingModule),            
            },
            {
                path: 'error', component: ErrorPageComponent
            },
            {
                path: '**', redirectTo: 'error'
            }
        ], resolve : {data: StartPageResolver}
    }
]
@NgModule({
    declarations: [ 
        StartPageComponent,
        ErrorPageComponent
    ],
    imports: [SharedModule, RouterModule.forRoot(routes)],
    providers:[StartPageResolver],
    exports: [RouterModule]
  })
export class AppRoutingModule { }
