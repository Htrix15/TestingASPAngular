import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChangeUser } from 'src/app/models/change-user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import { MyValidators } from 'src/app/shared/MyValidators';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {

  public login: ChangeUser;
  public password: ChangeUser;

  public minLoginLength:number;
  public maxLoginLength:number;

  public minPasswordLength:number;
  public maxPasswordLength:number;

  public formLogin: FormGroup;
  public formPassword: FormGroup;

  public checkLoginSubscribe: Subscription; 
  public checkPasswordSubscribe: Subscription; 

  constructor(private dataService: DataService) {
    this.minLoginLength = 5;
    this.maxLoginLength = 15;
    this.minPasswordLength = 5;
    this.maxPasswordLength = 15;
  }
  
  ngOnInit(): void {

      this.formLogin = new FormGroup({
          oldLogin: new FormControl(null, [MyValidators.validateEmptyText(), Validators.minLength(this.minLoginLength | 5), Validators.maxLength(this.maxLoginLength | 15)]),
          newLogin: new FormControl(null, [MyValidators.validateEmptyText(), Validators.minLength(this.minLoginLength | 5), Validators.maxLength(this.maxLoginLength | 15)]),
        });
      this.formPassword = new FormGroup({
          oldPassword: new FormControl(null, [MyValidators.validateEmptyText(), Validators.minLength(this.minPasswordLength | 5), Validators.maxLength(this.maxPasswordLength | 15)]),
          newPassword: new FormControl(null, [MyValidators.validateEmptyText(), Validators.minLength(this.minPasswordLength | 5), Validators.maxLength(this.maxPasswordLength | 15)]),
        });
  }

  submitLogin(){
      let loginData = new ChangeUser(
          this.formLogin.controls.oldLogin.value,
          this.formLogin.controls.newLogin.value
      );
      this.checkLoginSubscribe = this.dataService.putUserDatas<ChangeUser, null>(loginData,"login").subscribe();
  }

  submitPassword(){
      let passwordData = new ChangeUser(
          this.formPassword.controls.oldPassword.value,
          this.formPassword.controls.newPassword.value
      );
      this.checkPasswordSubscribe = this.dataService.putUserDatas<ChangeUser, null>(passwordData,"password").subscribe();
  }

  ngOnDestroy(){
    if(this.checkLoginSubscribe){this.checkLoginSubscribe.unsubscribe()}
    if(this.checkPasswordSubscribe){this.checkPasswordSubscribe.unsubscribe()}
  }
}
