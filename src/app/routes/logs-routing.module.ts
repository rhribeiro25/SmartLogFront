import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LogResolverGuard } from "../guards/log-resolver.guard";
import { FormComponent } from "../components/logs/form/form.component";
import { UploadComponent } from "../components/logs/upload/upload.component";
import { ListComponent } from "../components/logs/list/list.component";

const routes: Routes = [
  { path: "", component: ListComponent },
  { path: "list", component: ListComponent },
  {
    path: "create",
    component: FormComponent,
    resolve: {
      log: LogResolverGuard
    }
  },
  { path: "upload", component: UploadComponent },
  {
    path: "update/:id",
    component: FormComponent,
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
