import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReusetabComponent} from './reusetab/reusetab.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ReusetabComponent,
  ],
  exports: [
    CommonModule,
    ReusetabComponent
  ],
})
export class SharedComponentsModule {
}
