import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { CrudService } from "../shared/crud.service";
import { Log } from "./log";
import { take } from "rxjs/operators";

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
}
