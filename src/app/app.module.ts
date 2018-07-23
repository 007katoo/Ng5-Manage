import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { SharedServicesModule } from './shared/shared.services.module';
import { ToastrModule } from 'ngx-toastr';
import { SharedUiModule } from './shared/shared-ui.module';
import { AppReuseStrategy } from './appReuseStrategy';
import { RouteReuseStrategy } from '@angular/router' 


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedUiModule,
    HttpModule,
    ToastrModule.forRoot(),
    SharedServicesModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [    
    { provide: RouteReuseStrategy, useClass: AppReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
