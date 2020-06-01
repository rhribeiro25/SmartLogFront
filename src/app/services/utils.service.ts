import { Injectable } from "@angular/core";
import * as moment from "moment";

@Injectable({
  providedIn: "root"
})
export default class UtilsService {
  formatingDate_DD_MM_AAAA(date: Date) {
    return moment(date).format("DD/MM/YYYY");
  }

  formatingDate_yyyy_MM_dd_HH_mm_ss_SSS(date: Date) {
    return moment(date).format("YYYY-MM-DD HH:mm:ss.SSS");
  }
}
