import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { menus } from './menus';
import { filter } from "rxjs/operators";  //操作符

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements AfterViewInit, OnInit, OnDestroy {
  public menus: any = menus;
  public statePath: any = {  // 侧边栏状态
    index: -1, // 层数
    pathId: ''  // 路径ID
  };

  constructor( protected router: Router) { }

  ngOnInit () {
    this.statePath.index = sessionStorage.getItem('StatePath1');
    this.statePath.pathId = sessionStorage.getItem('StatePath2');
  }

  ngAfterViewInit () {
    if (this.statePath.pathId) {
      setTimeout(() => {
        this.changeClass(this.statePath.index - 0, this.statePath.pathId - 0, true);
      });
    }
  }
  // 改变小图标
  public changeArrow(index: any, routeLink: any) {
    if ( routeLink !== undefined) {
      sessionStorage.setItem('StatePath1', index);
      sessionStorage.setItem('StatePath2', '-1');
      this.router.navigate([routeLink]);
    }
    this.menus.forEach((menu) => {
      if (index === menu.index) {
        menu.isActive = !menu.isActive;
        menu.plusActive = menu.isActive ? 'inactive' : 'active';
        menu.minusActive = menu.isActive ? 'active' : 'inactive';
      }else {
        menu.isActive = false;
        menu.plusActive = 'active';
        menu.minusActive = 'inactive';
        menu.list.forEach((list) => {
          list.isActive = false;
        });
      }
    });
  }

  // 修改点击之后菜单的样式
  public changeClass(menuIndex: any, listIndex: any, type: boolean = false) {
   this.menus.forEach((menu) => {
     if (menuIndex === menu.index) {
       if (type) {
         menu.isActive = !menu.isActive;
         if (listIndex !== '-1') {
           const dom = document.getElementById(menu.id);
           if (dom) {
             dom.classList.add('show');
           }
         }
       }
       menu.list.forEach((list, index2) => {
         if ( listIndex === index2 + 1) {
           list.isActive = true;
           if (!type) {
             this.statePath.index = menuIndex;
             this.statePath.pathId = listIndex;
             sessionStorage.setItem('StatePath1', menuIndex);
             sessionStorage.setItem('StatePath2', listIndex);
           }
         }else {
           list.isActive = false;
         }
       });
     }
   });
 }

  ngOnDestroy () {
    sessionStorage.removeItem('StatePath1');
    sessionStorage.removeItem('StatePath2');
    this.statePath = {
      index: -1,
      pathId: ''
    };
    this.menus.forEach((menu) => {
      menu.isActive = false;
      menu.list.forEach( (list) => {
        list.isActive = false;
      });
    });
  }
}
