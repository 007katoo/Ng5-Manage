import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable } from 'rxjs'
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { closeRegexs } from '../../parent.url.variable';

@Injectable({
  providedIn: 'root'
})
export class ReusetabService {

  private _cachedChange: BehaviorSubject<any> = new BehaviorSubject< any >(null);
  private _cached: any[] = [];
  private removeUrlBuffer: string;
  private _titleCached: { [url: string]: string } = {};
  constructor() { }

  /** 获取已缓存的路由 */
  get items(): any[] {
    return this._cached;
  }

  set items(menuList){
    this._cached = menuList;
  }

  /** 订阅缓存变更通知 */
  get change(): Observable<any> {
    return this._cachedChange.asObservable(); // .pipe(filter(w => w !== null));
  }

  private remove(url: string | number, includeNonCloseable: boolean): boolean {
    const idx = typeof url === 'string' ? this.index(url) : url;
    const item = idx !== -1 ? this._cached[idx] : null;
    if (!item || (!includeNonCloseable && !item.closable)) return false;

    this.destroy(item._handle);

    this._cached.splice(idx, 1);
    delete this._titleCached[url];
    return true;
  }

  /**
   * 根据URL移除标签
   *
   * @param [includeNonCloseable=false] 是否强制包含不可关闭
   */
  close(url: string, includeNonCloseable = false) {
    this.removeUrlBuffer = url;

    this.remove(url, includeNonCloseable);

    this._cachedChange.next({ active: 'close', url, list: this._cached });

    return true;
  }


  closeByRegex(pattern,url?) {
    var newCache:any[] = [];
    var urlRegex = new RegExp(pattern);
    for (var i=0;i<this._cached.length;i++) {
      var cache = this._cached[i]
      var matchFlag = urlRegex.test(cache.url);
      if (cache.url == url) {
        newCache.push(cache);
      } else {
        if (matchFlag) {
        
        } else {
          newCache.push(cache);
        }
      }
    }
    this._cached = newCache;
    this._cachedChange.next({ active: 'close', list: this._cached });
  }

  closeAllByRegex(url) {
    for (var regexStr of closeRegexs) {
      var regex = new RegExp(regexStr);
      if (regex.test(url)) {
        this.closeByRegex(regexStr);
        break;
      }
    }
  }

  /**
   * 存储
   */
  store(_snapshot: ActivatedRouteSnapshot) {
    const url = this.getUrl(_snapshot);
    const idx = this.index(url);
    const rootRouter = this.getRootRouter(_snapshot);
    var item = {};
    if (rootRouter.data.title) {
      item = {
        title: rootRouter.data.title,
        url,
        isSelect:true,
        reuse:true,
      };
      this._cached.forEach(p => p.isSelect = false);
      if (idx === -1) {
        this._cached.push(item);
      } else {
        this._cached[idx] = item;
      }
      this.removeUrlBuffer = null;

      this._cachedChange.next({ active: 'add', item, list: this._cached });
    } 
    
  }

  /** 获取指定路径缓存所在位置，`-1` 表示无缓存 */
  index(url: string): number {
    return this._cached.findIndex(w => w.url === url);
  }

  private destroy(_handle: any) {
    if (_handle && _handle.componentRef && _handle.componentRef.destroy)
      _handle.componentRef.destroy();
  }

   /**
   * 根据快照获取URL地址
   */
  getUrl(route: ActivatedRouteSnapshot): string {
    let next = this.getTruthRoute(route);
    const segments = [];
    while (next) {
      segments.push(next.url.join('/'));
      next = next.parent;
    }
    const url =
      '/' +
      segments
        .filter(i => i)
        .reverse()
        .join('/');
    return url;
  }

  getTruthRoute(route: ActivatedRouteSnapshot) {
    let next = route;
    while (next.firstChild) next = next.firstChild;
    return next;
  }

  private runHook(method: string, url: string, comp: any) {
    if (comp.instance && typeof comp.instance[method] === 'function')
      comp.instance[method]();
  }

  getRootRouter(route: ActivatedRouteSnapshot) {
    if (route.children.length > 0) {
      route = route.children[0];
      return this.getRootRouter(route);
    } else {
      return route;
    }
  }

  // removeUnReuseTab(url) {
  //   for (var i=0;i<this._cached.length;i++) {
  //     var cache = this._cached[i];
  //     if(cache.url = url && !cache.reuse) {
  //       this._cached.splice(i,1);
  //       this._cachedChange.next({ active: 'close', list: this._cached });
  //       break;
  //     }
  //   }

  // }
  

}
