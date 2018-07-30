import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription,combineLatest } from 'rxjs';
import { filter,map,mergeMap } from 'rxjs/operators';
import { ReusetabService } from '../shared/reusetab/reusetab.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private sub$:Subscription;

  //路由列表
  menuList: Array<{ title: string, url: string, isSelect:boolean }>=[];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private reuseTabSrv: ReusetabService,
  ) {
    const route$ =  this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    )
    this.sub$ = combineLatest(this.reuseTabSrv.change,route$).subscribe(([res,e]) => {
      this.genList(res);
    });

  }

  ngOnInit() {

  }

  genList(res) {
    if(res) {
      console.log(res);
      this.menuList = res.list;
    }
  }
}
