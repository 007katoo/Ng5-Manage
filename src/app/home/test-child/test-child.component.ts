import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test-child',
  templateUrl: './test-child.component.html',
  styleUrls: ['./test-child.component.css']
})
export class TestChildComponent implements OnInit {

  constructor(
    private activateRoute:ActivatedRoute,
  ) { }

  id = this.activateRoute.snapshot.paramMap.get("id");

  dataSet = [];

  ngOnInit(): void {
    console.log(this.id);
    for (let i = 0; i < 100; i++) {
      this.dataSet.push({
        name   : `Edward King ${i}`,
        age    : 32,
        address: `London, Park Lane no. ${i}`
      });
    }
  }


}
