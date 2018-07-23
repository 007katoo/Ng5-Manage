import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Route,Router } from '@angular/router';

@Component({
  selector: 'reusetab',
  templateUrl: './reusetab.component.html',
  styleUrls: ['./reusetab.component.css']
})
export class ReusetabComponent implements OnInit,OnChanges {

  @Input('list') list;

  constructor(
    // private route:Route,
    private router:Router,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.list);
  }

  clickFunc(node) {
    console.log(node);
    this.router.navigateByUrl(node.module);
  }

}
