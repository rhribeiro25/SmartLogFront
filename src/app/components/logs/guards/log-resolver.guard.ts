import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { LogsService } from "src/app/services/logs.service";
import { Log } from "src/app/models/log";

@Injectable({
  providedIn: "root"
})
export class LogResolverGuard implements Resolve<Log> {
  constructor(private service: LogsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Log> {
    if (route.params && route.params["id"]) {
      return this.service.findByID(route.params["id"]);
    }

    return of({
      id: null,
      createdat: null,
      ip: null,
      request: null,
      status: null,
      userAgent: null
    });
  }
}
