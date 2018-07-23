import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProfileComponent} from './profile.component';

const routes: Routes = [
  { path: '', component: ProfileComponent,data: {title: 'profile', module: '/Profile',reuse:true} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

