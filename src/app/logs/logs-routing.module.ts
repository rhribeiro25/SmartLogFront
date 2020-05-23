import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LogsListaComponent } from "./logs-lista/logs-lista.component";
import { LogsFormComponent } from "./logs-form/logs-form.component";
import { LogResolverGuard } from "./guards/log-resolver.guard";

const routes: Routes = [
  { path: "", component: LogsListaComponent },
  {
    path: "novo",
    component: LogsFormComponent,
    resolve: {
      log: LogResolverGuard
    }
  },
  {
    path: "editar/:id",
    component: LogsFormComponent,
    resolve: {
      log: LogResolverGuard
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogsRoutingModule {}
