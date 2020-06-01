import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { LogsService } from "src/app/services/logs.service";
import { AlertModalService } from "src/app/services/alert-modal.service";

@Component({
  selector: "app-logs-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"]
})
export class FormComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private service: LogsService,
    private modal: AlertModalService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const log = this.route.snapshot.data["log"];

    this.form = this.fb.group({
      id: [log.id],
      createdAt: [log.createdAt],
      ip: [log.ip, [Validators.required, Validators.minLength(9), Validators.maxLength(15)]],
      request: [log.request, [Validators.required, Validators.minLength(10), Validators.maxLength(32)]],
      status: [log.status, [Validators.required, Validators.minLength(3), Validators.pattern("[0-9]*")]],
      userAgent: [log.userAgent, [Validators.required, Validators.minLength(24), Validators.maxLength(512)]]
    });
  }

  hasError(field: string) {
    return this.form.get(field).errors;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.form.value);
    if (this.form.valid) {
      console.log("submit");

      let msgSuccess = "Log criado com sucesso!";
      let msgError = "Erro ao criar log, tente novamente!";
      if (this.form.value.id) {
        msgSuccess = "Log atualizado com sucesso!";
        msgError = "Erro ao atualizar log, tente novamente!";
      }
      this.service.save(this.form.value).subscribe(
        success => {
          this.modal.showAlertSuccess(msgSuccess);
          this.location.back();
        },
        error => this.modal.showAlertDanger(msgError)
      );
    }
  }

  onCancel() {
    this.submitted = false;
    this.form.reset();
    this.location.back();
  }
}
