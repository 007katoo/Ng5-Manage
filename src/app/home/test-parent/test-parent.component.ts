import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-parent',
  templateUrl: './test-parent.component.html',
  styleUrls: ['./test-parent.component.css']
})
export class TestParentComponent implements OnInit {

  constructor(
    private router:Router,
  ) { }

  count:number = 0;

  ngOnInit() {
    console.log("parent");
    this.count = this.count +1;
  }

  tochild() {
    this.router.navigateByUrl("/Parent/Child")
  }
}
