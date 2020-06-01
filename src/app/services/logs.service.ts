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

  findByIp(ip: String) {
    return this.http.get<Log[]>(`${environment.BASE_URL}/logs/find-by-ip/${ip}`).pipe(take(1));
  }

  findByCreatedAtFromTo(from: String, to: String) {
    return this.http.get<Log[]>(`${environment.BASE_URL}/logs/find-by-createdat-between/${from}/${to}`).pipe(take(1));
  }

  findByStatus(status: number) {
    console.log(status);
    return this.http.get<Log[]>(`${environment.BASE_URL}/logs/find-by-status/${status}`).pipe(take(1));
  }

  createByBatch(formData: FormData) {
    return this.http.post(`${environment.BASE_URL}/logs/create-by-batch`, formData, {
      observe: "events",
      reportProgress: true
    });
  }
}
