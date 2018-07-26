import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReusetabComponent} from './reusetab/reusetab.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
  ],
  declarations: [
    ReusetabComponent,
  ],
  exports: [
    CommonModule,
    ReusetabComponent
  ]
})
export class SharedComponentsModule {
}
