import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { empty, EMPTY, Observable, Subject } from "rxjs";
import { catchError, switchMap, take } from "rxjs/operators";
import { AlertModalService } from "../../shared/alert-modal.service";
import { Log } from "../log";
import { LogsService } from "../logs.service";
import * as moment from "moment";

@Component({
  selector: "app-logs-lista",
  templateUrl: "./logs-lista.component.html",
  styleUrls: ["./logs-lista.component.scss"],
  preserveWhitespaces: true
})
export class LogsListaComponent implements OnInit {
  deleteModalRef: BsModalRef;
  @ViewChild("deleteModal", { static: true }) deleteModal;

  logs$: Observable<Log[]>;
  error$ = new Subject<boolean>();

  logSelecionado: Log;

  constructor(
    private service: LogsService,
    private modalService: BsModalService,
    private alertService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.onRefresh();
  }

  onRefresh() {
    this.logs$ = this.service.findAll().pipe(
      catchError(error => {
        console.error(error);
        this.handleError();
        return empty();
      })
    );
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

  formatingDate_DD_MM_AAAA(date: Date) {
    return moment(date).format("MM/DD/YYYY");
  }
}
