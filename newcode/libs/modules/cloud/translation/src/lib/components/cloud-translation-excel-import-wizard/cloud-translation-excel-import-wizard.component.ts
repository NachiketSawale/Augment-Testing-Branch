/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef,ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  getCustomDialogDataToken } from '@libs/ui/common';
import { IExcelImportDialogValue} from '../../model/wizards/interfaces/excel-import-dialog-value.interface';
import { PlatformCommonModule, Translatable } from '@libs/platform/common';
import { CloudTranslationWizardService } from '../../services/wizards/cloud-translation-wizard.service';


@Component({
  selector: 'cloud-translation-excel-import-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule,PlatformCommonModule],
  templateUrl: './cloud-translation-excel-import-wizard.component.html',
  styleUrl: './cloud-translation-excel-import-wizard.component.scss'
})

/**
 * Component responsible for managing Excel import wizard functionality.
 */
export class CloudTranslationExcelImportWizardComponent<T extends object>{

  private readonly dialogWrapper = inject(getCustomDialogDataToken<IExcelImportDialogValue, CloudTranslationExcelImportWizardComponent<T>>());
  private readonly excelImportWizardService = inject(CloudTranslationWizardService);
  @ViewChild('fileElement') public fileElementRef!: ElementRef<HTMLInputElement>;

  /**
   * Indicates whether to display the file upload in UI.
   */
  public showFileUpload: boolean = true;

  /**
   * The name of the selected file.
   */
  public fileName!: Translatable ;

  /**
   * The selected file.
   */
  private selectedFile!: File;
  
  /**
   * Indicates whether the upload button is disabled..
   */
  public isUploadBtnDisabled: boolean = true;

  /**
   * The intro text for the file upload component..
   */
  public introText = this.dialogWrapper.value?.introText;

  /**
   * Opens the file chooser dialog when the user clicks on the file input.
   */
  public chooseFile(): void {
    this.fileElementRef.nativeElement.click();
  }

  /**
   * Handles the file selection event.
   * @param event - The file selection event.
   */
  public onFileSelected(event: Event): void{
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
      this.isUploadBtnDisabled = false; 
      this.fileElementRef.nativeElement.focus();
    }
  }

  /**
   * Initiates the file upload process.
   */
  public onClickUploadBtn(): void{
   this.showFileUpload =false;
   this.isUploadBtnDisabled= true;
   if(this.selectedFile){
    this.excelImportWizardService.showLanguageSelectionDialog(this.selectedFile);  
   }   
   this.dialogWrapper.close(); 
  }  

  /**
   * Determines if the upload button should be disabled.
   * @returns {boolean}
   */
  public uploadBtnDisabled(): boolean {
    return this.isUploadBtnDisabled;
  }

}





