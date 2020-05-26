import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef } from "ngx-bootstrap/modal";
import { EMPTY, Subject, Subscription } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, take, filter } from "rxjs/operators";
import UtilsService from "src/app/shared/utils.service";
import { AlertModalService } from "../../shared/alert-modal.service";
import { Log } from "../log";
import { LogsService } from "../logs.service";

@Component({
  selector: "app-logs-lista",
  templateUrl: "./logs-lista.component.html",
  styleUrls: ["./logs-lista.component.scss"],
  preserveWhitespaces: true
})
export class LogsListaComponent implements OnInit {
  deleteModalRef: BsModalRef;
  @ViewChild("deleteModal", { static: true }) deleteModal;
  @ViewChild("refresh") refresh;
  logs: Log[];
  error$ = new Subject<boolean>();
  logSelecionado: Log;
  sub: Subscription[] = [];
  params = new FormControl();

  constructor(
    private service: LogsService,
    private utils: UtilsService,
    private alertService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub.push(
      this.service
        .findAll()
        .pipe(
          catchError(error => {
            console.error(error);
            if (error.status !== 404) this.handleError();
            this.logs = [];
            return EMPTY;
          })
        )
        .subscribe(res => (this.logs = res))
    );
    this.sub.push(
      this.params.valueChanges
        .pipe(
          map(value => value.trim()),
          filter(value => value !== null && value !== ""),
          debounceTime(200),
          distinctUntilChanged(),
          switchMap(value =>
            this.service.findByParams(value).pipe(
              catchError(error => {
                console.error(error);
                if (error.status !== 404) this.handleError();
                this.logs = [];
                return EMPTY;
              })
            )
          )
        )
        .subscribe(res => (this.logs = res))
    );
  }

  onRefresh() {
    this.params.setValue("");
    this.sub.push(
      this.service
        .findAll()
        .pipe(
          catchError(error => {
            console.error(error);
            if (error.status !== 404) this.handleError();
            this.logs = [];
            return EMPTY;
          })
        )
        .subscribe(res => (this.logs = res))
    );
  }

  onSearch() {
    let value = this.params.value;
    if (value && (value = value.trim()) !== "") {
      this.sub.push(
        this.service
          .findByParams(value)
          .pipe(
            catchError(error => {
              console.error(error);
              if (error.status !== 404) this.handleError();
              this.logs = [];
              return EMPTY;
            })
          )
          .subscribe(res => (this.logs = res))
      );
    }
  }

  handleError() {
    this.alertService.showAlertDanger("Erro ao carregar logs. Tente novamente mais tarde!");
  }

  onEdit(id) {
    this.router.navigate(["editar", id], { relativeTo: this.route });
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
          this.onRefresh();
          this.alertService.showAlertSuccess("Sucesso ao remover log!");
        }
      );
  }

  onConfirmDelete() {
    this.service.remove(this.logSelecionado.id).subscribe(
      success => {
        this.onRefresh();
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
