import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef } from "ngx-bootstrap/modal";
import { EMPTY, Subject, Subscription } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, take } from "rxjs/operators";
import { Log } from "src/app/models/log";
import { AlertModalService } from "src/app/services/alert-modal.service";
import { LogsService } from "src/app/services/logs.service";
import UtilsService from "src/app/services/utils.service";
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";

@Component({
  selector: "app-logs-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "pt-BR" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],
  preserveWhitespaces: true
})
export class ListComponent implements OnInit {
  deleteModalRef: BsModalRef;
  @ViewChild("deleteModal", { static: true }) deleteModal;
  @ViewChild("reload") reload;
  logs: Set<Log>;
  logsFilter: Map<string, Set<Log>>;
  logsStatus: Set<Log>;
  logsDate: Set<Log>;
  logsIp: Set<Log>;
  error$ = new Subject<boolean>();
  logSelecionado: Log;
  sub: Subscription[] = [];
  ip = new FormControl();
  status = new FormControl();
  dateFrom = new FormControl();
  dateTo = new FormControl();

  constructor(
    private service: LogsService,
    public utils: UtilsService,
    private alertService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.logsFilter = new Map<string, Set<Log>>();

    this.sub.push(
      this.service
        .findAll()
        .pipe(
          catchError(error => {
            console.error(error);
            this.handleError(error.status);
            this.logs = new Set<Log>();
            return EMPTY;
          })
        )
        .subscribe(res => (this.logs = new Set<Log>(res)))
    );

    this.sub.push(
      this.ip.valueChanges
        .pipe(
          map(value => value.trim()),
          filter(value => value !== null && value !== ""),
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(value =>
            this.service.findByIp(value).pipe(
              catchError(error => {
                console.error(error);
                this.handleError(error.status);
                this.logsIp = new Set<Log>();
                return EMPTY;
              })
            )
          )
        )
        .subscribe(res => {
          this.logsFilter.set("IP", new Set<Log>(res));
          this.onCancatLogsFilter();
        })
    );

    this.sub.push(
      this.dateTo.valueChanges
        .pipe(
          filter(value => value !== null && value !== ""),
          distinctUntilChanged(),
          switchMap(value =>
            this.service
              .findByCreatedAtFromTo(
                this.utils.formatingDate_yyyy_MM_dd_HH_mm_ss_SSS(this.dateFrom.value),
                this.utils.formatingDate_yyyy_MM_dd_HH_mm_ss_SSS(value)
              )
              .pipe(
                catchError(error => {
                  console.error(error);
                  this.handleError(error.status);
                  this.logsDate = new Set<Log>();
                  return EMPTY;
                })
              )
          )
        )
        .subscribe(res => {
          this.logsFilter.set("DATE", new Set<Log>(res));
          this.onCancatLogsFilter();
        })
    );

    this.sub.push(
      this.status.valueChanges
        .pipe(
          map(value => value.trim()),
          filter(value => value !== null && value !== "" && value.length === 3),
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(value =>
            this.service.findByStatus(value).pipe(
              catchError(error => {
                console.error(error);
                this.handleError(error.status);
                this.logsStatus = new Set<Log>();
                return EMPTY;
              })
            )
          )
        )
        .subscribe(res => {
          this.logsFilter.set("STATUS", new Set<Log>(res));
          this.onCancatLogsFilter();
        })
    );
  }

  onCancatLogsFilter() {
    this.logs = new Set<Log>();
    for (var [key, value] of this.logsFilter) {
      if (!this.status.value) this.logsFilter.set("STATUS", new Set<Log>());
      if (!this.dateTo.value) this.logsFilter.set("DATE", new Set<Log>());
      if (!this.ip.value) this.logsFilter.set("IP", new Set<Log>());
      value.forEach(val => {
        let exist = false;
        this.logs.forEach(log => {
          if (log.id === val.id) {
            exist = true;
            return;
          }
        });
        if (!exist) this.logs.add(val);
      });
    }
  }

  onReload() {
    this.logs = null;
    this.logsFilter = new Map<string, Set<Log>>();
    this.ip.setValue("");
    this.dateFrom.setValue("");
    this.dateTo.setValue("");
    this.status.setValue("");
    this.sub.push(
      this.service
        .findAll()
        .pipe(
          catchError(error => {
            console.error(error);
            this.handleError(error.status);
            this.logs = new Set<Log>();
            return EMPTY;
          })
        )
        .subscribe(res => (this.logs = new Set<Log>(res)))
    );
  }

  handleError(status: number) {
    if (status === 500) this.alertService.showAlertDanger("Falha ao carregar logs. Problemas no servidor!");
    else if (status === 404) this.alertService.showAlertDanger("Logs não encontrados!");
    else if (status === 400) this.alertService.showAlertDanger("Falha ao carregar logs. Requisição inválida!");
    else this.alertService.showAlertDanger("Falha ao carregar logs!");
  }

  onEdit(id) {
    this.router.navigate(["update", id], { relativeTo: this.route });
  }

  onDelete(log) {
    this.logSelecionado = log;

    const result$ = this.alertService.showConfirm("Confirmacao", "Tem certeza que deseja remover esse log?");
    result$
      .asObservable()
      .pipe(
        take(1),
        switchMap(result => (result ? this.service.remove(log.id) : EMPTY))
      )
      .subscribe(
        error => {
          this.alertService.showAlertDanger("Erro ao remover log. Tente novamente mais tarde!");
        },
        success => {
          this.onReload();
          this.alertService.showAlertSuccess("Sucesso ao remover log!");
        }
      );
  }

  onConfirmDelete() {
    this.service.remove(this.logSelecionado.id).subscribe(
      success => {
        this.onReload();
        this.deleteModalRef.hide();
      },
      error => {
        this.alertService.showAlertDanger("Erro ao remover log. Tente novamente mais tarde!");
        this.deleteModalRef.hide();
      }
    );
  }

  onDeclineDelete() {
    this.deleteModalRef.hide();
  }
}
