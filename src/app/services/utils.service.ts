import { Injectable } from "@angular/core";
import * as moment from "moment";

@Injectable({
  providedIn: "root"
})
export default class UtilsService {
  formatingDate_DD_MM_AAAA(date: Date) {
    return moment(date).format("DD/MM/YYYY");
  }
}
