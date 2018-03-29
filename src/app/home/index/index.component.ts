import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  public timeLine = [
    {'time': {'date': '2018-3-29', times: '12:00:00'}, 'title': 'init', 'info': 'init'},
    {'time': {'date': '2018-3-29', times: '15:25:36'}, 'title': '添加时间范围控件', 'info': '基于bootstrap-daterangepicker.js写的时间范围控件。'},
    {'time': {'date': '2018-3-29', times: '16:46:45'}, 'title': '添加表格', 'info': '基于ngx-datatable写的表格。'}];

  constructor() {
  }

  ngOnInit() {
  }
}