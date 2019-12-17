import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ChartsModule } from 'ng2-charts';
import { AmplifyService, AmplifyModules, AmplifyAngularModule, AmplifyIonicModule } from 'aws-amplify-angular';
import Interactions from '@aws-amplify/interactions';
import Storage from '@aws-amplify/storage';
import Auth from '@aws-amplify/auth';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    ChartsModule,
    AmplifyAngularModule,
    AmplifyIonicModule
  ],
  providers: [
    AmplifyService
    /*
    {
      provide: AmplifyService,
      useFactory: () => {
        return AmplifyModules({
          Auth,
          Storage,
          Interactions
        });
      }
    }
    */
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
