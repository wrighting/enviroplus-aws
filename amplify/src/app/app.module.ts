import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TempPageModule } from './temp/temp.module';
import { TempPage } from './temp/temp.page';

import { ChartsModule } from 'ng2-charts';
import { AmplifyService, AmplifyAngularModule } from 'aws-amplify-angular';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [TempPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, TempPageModule, ChartsModule, AmplifyAngularModule],
  providers: [
    AmplifyService,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
