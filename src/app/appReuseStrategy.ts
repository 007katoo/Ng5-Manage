import {ActivatedRouteSnapshot, Router, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';
import {Injectable} from '@angular/core';

interface IRouteConfigData {
  reuse: boolean;
}

interface ICachedRoute {
  handle: DetachedRouteHandle;
  data: IRouteConfigData;
}

@Injectable()
export class AppReuseStrategy implements RouteReuseStrategy {
  private static routeCache = new Map<string, ICachedRoute>();
  private static waitDelete: string; // 当前页未进行存储时需要删除
  private static currentDelete: string;  // 当前页存储过时需要删除
  private router: Router;

  constructor() {}

  /** 进入路由触发，判断是否是同一路由 */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    console.log("shouldReuseRoute",future.routeConfig === curr.routeConfig,curr,future);
    if (future.routeConfig && future.routeConfig.path.indexOf(":id")!=-1) {
      if(future.params["id"]!=curr.params["id"]) {
        return false;
      }
    }
    console.log(curr,future)
    return future.routeConfig === curr.routeConfig;
  }

  /** 表示对所有路由允许复用 如果你有路由不想利用可以在这加一些业务逻辑判断，这里判断是否有data数据判断是否复用 */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const data = this.getRouteData(route);
    if (data) {
      console.log("shouldDetach",route,true);
      return true;
    }
    console.log("shouldDetach",route,false);
    return false;
  }

  /** 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象 */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const url = this.getFullRouteUrl(route);
    const data = this.getRouteData(route);
    if (AppReuseStrategy.waitDelete && AppReuseStrategy.waitDelete === url) {
      // 如果待删除是当前路由，且未存储过则不存储快照
      AppReuseStrategy.waitDelete = null;
      console.log("store",route,false)
      return null;
    }else {
      // 如果待删除是当前路由，且存储过则不存储快照
      if (AppReuseStrategy.currentDelete && AppReuseStrategy.currentDelete === url) {
        AppReuseStrategy.currentDelete = null;
        console.log("store",route,false)
        return null;
      }else {
        AppReuseStrategy.routeCache.set(url, { handle, data });
        this.addRedirectsRecursively(route);
        console.log("store",route,true,AppReuseStrategy.routeCache);
      }
    }
  }

  /** 若 path 在缓存中有的都认为允许还原路由 */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const url = this.getFullRouteUrl(route);
    console.log("shouldAttach",AppReuseStrategy.routeCache.has(url),url);
    return AppReuseStrategy.routeCache.has(url);
  }

  /** 从缓存中获取快照，若无则返回nul */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const url = this.getFullRouteUrl(route);
    var handle = AppReuseStrategy.routeCache.has(url)
    ? AppReuseStrategy.routeCache.get(url).handle
    : null;
    console.log("retrieve",handle);
    return handle;
    
  }

  private addRedirectsRecursively(route: ActivatedRouteSnapshot): void {
    const config = route.routeConfig;
    if (config) {
      if (!config.loadChildren) {
        const routeFirstChild = route.firstChild;
        const routeFirstChildUrl = routeFirstChild ? this.getRouteUrlPaths(routeFirstChild).join('/') : '';
        const childConfigs = config.children;
        if (childConfigs) {
          const childConfigWithRedirect = childConfigs.find(c => c.path === '' && !!c.redirectTo);
          if (childConfigWithRedirect) {
            childConfigWithRedirect.redirectTo = routeFirstChildUrl;
          }
        }
      }
      route.children.forEach(childRoute => this.addRedirectsRecursively(childRoute));
    }
  }

  private getFullRouteUrl(route: ActivatedRouteSnapshot): string {
    return this.getFullRouteUrlPaths(route).join('/');
  }

  private getFullRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
    const paths = this.getRouteUrlPaths(route);
    return route.parent ? [ ...this.getFullRouteUrlPaths(route.parent), ...paths ] : paths;
  }

  private getRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
    return route.url.map(urlSegment => urlSegment.path);
  }

  private getRouteData(route: ActivatedRouteSnapshot): IRouteConfigData {
    return route.routeConfig && route.routeConfig.data as IRouteConfigData;
      // return route.data as IRouteConfigData;
  }

  /** 用于删除路由快照*/
  public static deleteRouteSnapshot(url: string): void {
    if (url[0] === '/') {
      url = url.substring(1);
    }
    if (AppReuseStrategy.routeCache.has(url)) {
      AppReuseStrategy.routeCache.delete(url);
      AppReuseStrategy.currentDelete = url;
    }else {
      AppReuseStrategy.waitDelete = url;
    }
  }

  public static removeRouteCacheByUrlPattern(currentUrl,pattern:string) {
    var patternReg = new RegExp(pattern);
    var keyIterator = AppReuseStrategy.routeCache.keys();
    var key = keyIterator.next();
    while (!key.done) {
      if (patternReg.test(key.value)&&key.value!=currentUrl) {
        AppReuseStrategy.deleteRouteSnapshot(key.value);
      }
      key = keyIterator.next();
    }
  }

}
