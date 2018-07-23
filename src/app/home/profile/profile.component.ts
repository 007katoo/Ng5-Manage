import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public timeLine = [{'time': {'date': '2017-6-23', times: '14:16:00'}, 'info': '127.0.0.1'},
    {'time': {'date': '2017-6-21', times: '17:26:45'}, 'info': '127.0.0.1'},
    {'time': {'date': '2017-6-12', times: '09:30:40'}, 'info': '127.0.0.1'}];

  public oldPwd1 = '';
  public passwordCurrent = '';
  public confirmPwd = '';

  constructor() { }

  ngOnInit() {
    sessionStorage.setItem('StatePath1', '-1');
    sessionStorage.setItem('StatePath2', '-1');
    console.log("test");
  }

}
