import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppReuseStrategy } from '../../appReuseStrategy';
import { ReusetabService } from './reusetab.service';

@Component({
  selector: 'reusetab',
  templateUrl: './reusetab.component.html',
  styleUrls: ['./reusetab.component.css'],
  providers:[ReusetabService],
})
export class ReusetabComponent {

  @Input("list") list

  constructor(
    private router:Router,
    private reusetabService: ReusetabService,
   ) {}

  to(event,item) {
    this.router.navigateByUrl(item.url);
    var currentUrl = this.router.routerState.snapshot.url;
    var regex = new RegExp("^/Parent/Child/")
    if (regex.test(currentUrl)) {
      for(var unit of this.list) {
        if (regex.test(unit.url)) {
          unit.url = currentUrl;
        }
        break;
      }
      console.log(this.list);
    }
  }

  closeUrl(url: string, isSelect: boolean, event: Event) {
    event.preventDefault();
    // 当前关闭的是第几个路由
    const index = this.list.findIndex(p => p.url === url);
    // 如果只有一个不可以关闭
    if (this.list.length === 1) return;
    this.list = this.list.filter(p => p.url !== url);
    // 删除复用
    
    AppReuseStrategy.deleteRouteSnapshot(url);
    this.reusetabService.closeAllByRegex(url);
    if (!isSelect) return;
    // 显示上一个选中
    let menu = this.list[index - 1];
    if (!menu) {// 如果上一个没有下一个选中
      menu = this.list[index];
    }
    this.list.forEach(p => p.isSelect = p.url === menu.url);
    // 显示当前路由信息
    this.router.navigate(['/' + menu.url]);
  }
}
