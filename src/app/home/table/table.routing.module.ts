import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TableComponent } from './table.component';

const routes: Routes = [
  { path: '', component: TableComponent,
    children: [
      {path: 'DataTable1', loadChildren: './data-table1/data-table1.module#DataTable1Module',data: {title: 'DataTable1', module: '/Table/DataTable1',reuse:true}},
      {path: 'DataTable2', loadChildren: './data-table2/data-table2.module#DataTable2Module',data: {title: 'DataTable2', module: '/Table/DataTable2',reuse:true}},
      {path: 'DataTableInline', loadChildren: './data-table-inline/data-table-inline.module#DataTableInlineModule',data: {title: 'DataTableInline', module: '/Table/DataTableInline',reuse:true}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableRoutingModule { }

