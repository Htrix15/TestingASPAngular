import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { AdminPageComponent } from '../pages/admin-page/admin-page.component';
import { LogonComponent } from '../pages/admin-page/children/logon/logon.component';
import { EditUserComponent } from '../pages/admin-page/children/edit-user/edit-user.component';

const routes: Routes = [
    {
        path: '',  component: AdminPageComponent, children:[
            { path: 'logon', component: LogonComponent},
            { path: '', redirectTo:'logon', pathMatch: 'full'},
            { path: 'edit', component: EditUserComponent, canActivate: [AuthGuard]},
        ]
    }
]

@NgModule({
    declarations: [ 
        AdminPageComponent,
        LogonComponent,
        EditUserComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers:[AuthGuard],
    exports: [RouterModule]
  })
export class AdminRoutingModule { }
