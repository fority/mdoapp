import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';

type UploadType = 'PCC' | 'CDE' | 'CPI' | 'PHOTO' | 'TEMPLATE' | 'STEP';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, FileUploadModule, InputNumberModule],
  selector: 'app-pdfuploader',
  templateUrl: './pdfuploader.component.html',
  styleUrls: ['./pdfuploader.component.css'],
})
export class PdfUploaderComponent {
  @Input() title: UploadType = 'PHOTO';
  @Output() onOKClick = new EventEmitter();
  @Output() onClearClick = new EventEmitter();
  @Output() onCancelClick = new EventEmitter();
  @ViewChild('upload') upload: FileUpload | undefined;

  PageNgModel: number = 0;
  FileUploadVisible = false;
  UploadedFiles: any[] = [];

  UploadHandler(event: FileUploadHandlerEvent) {
    this.UploadedFiles = [];
    for (let file of event.files) {
      this.UploadedFiles.push(file);
    }
  }

  OKClick() {
    if (!this.upload) return;
    this.upload.upload();
    this.onOKClick.emit({ File: this.UploadedFiles[0], Page: this.PageNgModel });
    this.Reset();
    this.onCancelClick.emit(false);
  }
  CancelClick() {
    this.Reset();
    this.onCancelClick.emit(false);
  }

  Reset() {
    if (!this.upload) return;
    this.upload.clear();
    this.UploadedFiles = [];
    this.PageNgModel = 0;
  }
}
