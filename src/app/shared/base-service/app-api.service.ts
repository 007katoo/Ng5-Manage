import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptionsArgs} from '@angular/http';
import {Observable} from "rxjs/index"; //Observable
import {publishLast,refCount } from "rxjs/operators";  //操作符

import {AuthService} from './auth.service';

// 定义返回结果的回调函数
export interface ServiceRequestSuccessCallback {
  (response: any): void;
}

export interface ServiceRequestErrorCallback {
  (code: number, message?: string, event?: string): void;
}

export interface ServiceRequestCallback {
  next: ServiceRequestSuccessCallback;
  error?: ServiceRequestErrorCallback;
}

// 调用远程Api的服务
@Injectable()
export class AppApiService {
  protected gateway_url: string;
  public service_route_area: string;
  public service_route_service: string;
  protected service_route_actoin: string;
  public service_version_major: number;
  public service_version_minor: number;
  public service_version_maintenance: number;
  public service_version_build: number;
  // 全局Url过滤器
  private urlFilters: ((url: string) => string)[] = [];
  // 全局选项过滤器
  private optionsFilters: ((options: RequestOptionsArgs) => RequestOptionsArgs)[] = [];
  // 全局内容过滤器
  private bodyFilters: ((body: any) => any)[] = [];
  // 全局结果过滤器
  private resultFilters: ((response: Response) => Response)[] = [];
  // 全局错误过滤器
  private errorFilters: ((error: any) => any)[] = [];
  // 默认结果转换器
  private resultConverter: (response: Response) => any;
  // 默认错误转换器
  private errorConverter: (error: any) => Observable<any>;

  constructor(protected http: Http,
              protected authService: AuthService) {

    this.gateway_url = 'http:*****';
    this.service_version_major = 1;
    this.service_version_minor = 0;
    this.service_version_maintenance = 0;
    this.service_version_build = 0;
    // 设置http头
    this.registerOptionsFilter(options => {
      options.headers.append('Content-Type', 'application/json');
      options.headers.append('SmartPay-Application', '100');
      if (this.authService.GetAccount()) {
        options.headers.append('Authorization', 'Bearer ' + this.authService.GetAccount().token);
      }
      return options;
    });
  }

  // 注册全局选项过滤器
  registerOptionsFilter(filter: (options: RequestOptionsArgs) => RequestOptionsArgs) {
    this.optionsFilters.push(filter);
  }

  // 调用Api函数
  call<T>(event: string,
          param: any,
          callback: ServiceRequestCallback) {
    const fullUrl = this.gateway_url;
    let options: RequestOptionsArgs;
    options = options || {method: 'POST'};
    options.headers = options.headers || new Headers();
    options.headers.append('SmartPay-Event', event);
    this.optionsFilters.forEach(h => {
      options = h(options);
    });
    options.body = param;

    console.log(options);

    this.http
      .request(fullUrl, options).pipe(
        publishLast(),
        refCount(),
      ).subscribe(response => {
        console.log(response);
        this.resultFilters.forEach(f => {
          response = f(response);
        });
        const code = +response.headers.get('SmartPay-Code');
        const res_data = response.json();
        callback.next(res_data.value);
      }, error => {
        // 过滤返回的错误
        this.errorFilters.forEach(f => {
          error = f(error);
        });
        // 转换返回的错误
        this.Error(event, -1, error, callback);
      });
  }

  // 获取key
  getKey(): string {
    return `${this.service_route_area || ''}-${this.service_route_service || ''}`;
  }

  // 错误处理
  protected Error(event: string, code: number, message: string, callback: ServiceRequestCallback): void {
    if (callback.error) {
      callback.error(code, message, event);
    }
  }
}
