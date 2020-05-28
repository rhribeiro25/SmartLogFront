import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LogResolverGuard } from "../guards/log-resolver.guard";
import { LogsFormComponent } from "../logs-form/logs-form.component";
import { LogsListaComponent } from "../logs-lista/logs-lista.component";

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
