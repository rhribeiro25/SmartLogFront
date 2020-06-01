import { Location } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { LogsService } from "src/app/services/logs.service";

@Component({
  selector: "app-logs-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.scss"]
})
export class UploadComponent implements OnInit, OnDestroy {
  files: Set<File>;
  progress: number;
  fileList: string[];
  sub: Subscription[];

  constructor(private service: LogsService, private location: Location) {}

  ngOnInit() {
    this.sub = [];
    this.progress = 0;
  }

  onChange(event) {
    this.fileList = [];
    this.progress = 0;
    const selectedFiles = <FileList>event.srcElement.files;
    this.files = new Set();
    for (let i = 0; i < selectedFiles.length; i++) {
      this.fileList.push(selectedFiles[i].name);
      this.files.add(selectedFiles[i]);
    }
    this.onUpload();
  }

  onUpload() {
    let count = this.files.size;
    if (this.files && this.files.size > 0) {
      this.files.forEach(file => {
        const formData = new FormData();
        formData.append("log", file, file.name);
        setTimeout(
          () =>
            this.sub.push(
              this.service.createByBatch(formData).subscribe(
                error => {},
                res => {
                  if (res["status"] === 201) {
                    this.progress += Math.round(100 / this.files.size + 0.5);
                    if (this.progress > 100) this.progress = 100;
                  }
                }
              )
            ),
          count * 500
        );
        count--;
      });
    }
  }

  onCancel() {
    this.location.back();
  }

  ngOnDestroy() {
    this.sub.forEach(s => s.unsubscribe());
  }
}
