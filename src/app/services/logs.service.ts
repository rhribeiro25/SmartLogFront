import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { take } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Log } from "../models/log";
import { CrudService } from "./crud.service";

@Injectable({
  providedIn: "root"
})
export class LogsService extends CrudService<Log> {
  constructor(protected http: HttpClient) {
    super(http, `${environment.BASE_URL}/logs`);
  }

  findByParams(params: String) {
    return this.http.get<Log[]>(`${environment.BASE_URL}/logs/find-by-params/${params}`).pipe(take(1));
  }

  findByCreatedAtFromTo(from: String, to: String) {
    return this.http.get<Log[]>(`${environment.BASE_URL}/logs/find-by-createdat-between/${from}/${to}`).pipe(take(1));
  }
}
