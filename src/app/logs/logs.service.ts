import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { CrudService } from "../shared/crud.service";
import { Log } from "./log";

@Injectable({
  providedIn: "root"
})
export class LogsService extends CrudService<Log> {
  constructor(protected http: HttpClient) {
    super(http, `${environment.BASE_URL}/logs`);
  }
}
