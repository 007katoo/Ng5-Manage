import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {filter,map,mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  //路由列表
  menuList: Array<{ title: string, url: string, isSelect:boolean }>=[];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title) {
  
      //路由事件
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      ).subscribe((event) => {
          //路由data的标题
        let title = event['title'];
        if (event.reuse) {
          this.menuList.forEach(p => p.isSelect=false);
          var url = this.router.routerState.snapshot.url;
          var menu = { title: title, url: url, isSelect:true};
          this.titleService.setTitle(title);
          let exitMenu=this.menuList.find(info=>info.title==title);
          if(exitMenu){//如果存在不添加，当前表示选中
            this.menuList.forEach(p => p.isSelect=p.title==title);
            return ;
          } 
          this.menuList.push(menu);
        }
      });
  }

  ngOnInit() {

  }


}
