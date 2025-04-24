/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit, inject } from '@angular/core';
import { PlatformCommonModule, PlatformTranslateService, Translatable } from '@libs/platform/common';
import { CloudTranslationWizardService } from '../../services/wizards/cloud-translation-wizard.service';
import { CloudTranslationImportExportService } from '../../services/cloud-translation-import-export.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {IExcelImportDialogValue} from '../../model/wizards/interfaces/excel-import-dialog-value.interface';
import { getCustomDialogDataToken } from '@libs/ui/common';
import { IExcelFileUploadResponse } from '../../model/wizards/interfaces/excel-file-upload-response.interface';
import { ICheckboxItem } from '../../model/wizards/interfaces/checkbox-item.interface';
import { ICheckboxOption } from '../../model/wizards/interfaces/checkbox-option.interface';
import { IInfoListItem } from '../../model/wizards/interfaces/info-list-item.interface';

@Component({
  selector: 'cloud-translation-language-selection-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule, PlatformCommonModule],
  templateUrl: './cloud-translation-language-selection-dialog.component.html',
  styleUrl: './cloud-translation-language-selection-dialog.component.scss'
})

/**
 * Component responsible for managing language selection dialog for cloud translation.
 */
export class CloudTranslationLanguageSelectionDialogComponent<T extends object> implements OnInit {

  private readonly translateService = inject(PlatformTranslateService);
  private readonly cloudTranslationWizardService = inject(CloudTranslationWizardService);
  private readonly cloudTranslationImportExportService = inject(CloudTranslationImportExportService);
  private readonly dialogWrapper = inject(getCustomDialogDataToken<IExcelImportDialogValue, CloudTranslationLanguageSelectionDialogComponent<T>>());


  /**
   * An array of checkbox items.
   */
  public checkboxItem: ICheckboxItem[] = this.dialogWrapper.value?.checkboxItem ?? [];

  /**
   * The title for the checkbox.
   */
  public checkboxTitle = this.dialogWrapper.value?.checkboxTitle ?? '';

  /**
   * An array of info list.
   */
  public infoList: IInfoListItem[] = [];

  /**
   * Indicates whether language selection is enabled.
   */
  public isLanguageSelection: boolean = this.dialogWrapper.value?.isLanguageSelection ?? false;

  /**
   * The message to display in the spinner.
   */
  public spinnermsg = this.dialogWrapper.value?.spinnermsg ?? '';

  /**
   * The default language.
   */
  public defaultLanguage= this.dialogWrapper.value?.defaultLanguage ?? '';

  /**
   * The title for reset change.
   */
  public resetChangedTitle = this.dialogWrapper.value?.resetChangedTitle ?? '';

  /**
   * Indicates whether changes should be reset.
   */
  public isResetChanged = this.dialogWrapper.value?.isResetChanged ?? false;

  /**
   * The UUID import.
   */
  public uuidImport = this.dialogWrapper.value?.uuidImport ?? '';

  /**
   * Indicates whether the component is currently loading.
   */
  public isLoading = this.dialogWrapper.value?.isLoading ?? true;

  /**
   *  The checkboxOptions
   */
  public checkboxOptions?: ICheckboxOption;

  /**
   * Boolean flat Design.
   */
  public flatDesign = this.dialogWrapper.value?.checkboxOptions?.flatDesign;

   /**
   * EnglishResource
   */
  public englishResource! :ICheckboxItem;


  public ngOnInit(): void {
    const selectedFile = this.dialogWrapper.value?.selectedFile as File;
    this.fileUpload(selectedFile);
  }

 /**
  * Handles the file upload process.
  * @param selectedFile - The selected file for upload.
  * @returns {void}
  */
  public fileUpload(selectedFile: File): void {
    this.cloudTranslationImportExportService.uploadFile(selectedFile).subscribe(
      (res: IExcelFileUploadResponse) => {
        const fileInfo = res.fileInfo;
        const uuidImport = res.uuid;

        this.cloudTranslationWizardService.setSessionUuid(uuidImport);

        fileInfo.languages.forEach((language: ICheckboxItem) => {
          if (language.field !== 'ENGLISH') {
            language.isChecked = false;
            language.text = language.field as Translatable;
            this.checkboxItem.push(language);
          }
        });

        this.englishResource = {
          field: 'ENGLISH',
          id: 1,
          culture: 'en',
          isChecked: false,
          text: 'ENGLISH',
        };

        if (fileInfo && fileInfo.resourceCount !== undefined) {
          this.infoList.push({
            key: this.translateService.instant('cloud.translation.languageSelectionDlg.resourceCount').text,
            value: fileInfo.resourceCount,
          });
        }

        if (fileInfo && fileInfo.languages && fileInfo.languages.length !== undefined) {
          this.infoList.push({
            key: this.translateService.instant('cloud.translation.languageSelectionDlg.languageCount').text,
            value: fileInfo.languages.length.toString(),
          });
        }

        this.isLoading = false;
        this.isLanguageSelection = true;
        if (this.dialogWrapper.value) {
          this.dialogWrapper.value.isLanguageSelection = true;
          this.dialogWrapper.value.uuidImport = uuidImport;
        }
      }
    );
  }

  /**
   * Retrieves the selected cultures from the dialog.
   * @returns {Translatable[]}  
   */
  public getSelectedCultures(): Translatable[]  {
    const selectedLanguages = this.checkboxItem.filter(item => item.isChecked) || [];
    if (this.englishResource.isChecked) {
      selectedLanguages.splice(0, 0, this.englishResource);
    }
    return selectedLanguages.map(language => language.culture as Translatable);
  }

 /**
  * Displays a preview of the import operation.
  */
  public onPreviewImportClicked(): void{
    const selectedCultures = this.getSelectedCultures();
    const isResetChanged = this.isResetChanged;
    const uuidImport = this.uuidImport;
    this.cloudTranslationWizardService.showPreviewImportDialog(selectedCultures, isResetChanged, uuidImport);
  }

 /**
  * Initiates the import process.
  */
  public onImportClicked(): void {
    const selectedCultures = this.getSelectedCultures();
    const isResetChanged = this.isResetChanged;
    const uuidImport = this.uuidImport;
    this.cloudTranslationWizardService.showImportReportDialog(selectedCultures, isResetChanged, uuidImport);
  }

 /**
  * Cancels the import operation and clears temporary data.
  */
  public onCancelClicked():void {
    this.cloudTranslationImportExportService.clearTempTable(this.cloudTranslationWizardService.sessionUuid.uuid);
    this.dialogWrapper.close();
  }

 /**
  * Checks if the button should be disabled based on the loading state.
  * @returns {boolean} 
  */
  public btnDisabled(): boolean {
    return this.isLoading;
  }

 /**
  * Checks if the import button should be disabled based on the loading state or the status of the English resource checkbox.
  * @returns {boolean}
  */
  public isImportButtonDisabled(): boolean {
    return this.isLoading || this.englishResource.isChecked;
  }
}