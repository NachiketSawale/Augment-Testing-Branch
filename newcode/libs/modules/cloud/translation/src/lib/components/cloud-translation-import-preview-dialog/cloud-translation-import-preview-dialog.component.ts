/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { IExcelImportDialogValue } from '../../model/wizards/interfaces/excel-import-dialog-value.interface';

@Component({
  selector: 'cloud-translation-import-preview-dialog',
  standalone: true,
  imports: [],
  templateUrl: './cloud-translation-import-preview-dialog.component.html',
  styleUrl: './cloud-translation-import-preview-dialog.component.scss'
})
export class CloudTranslationImportPreviewDialogComponent implements IExcelImportDialogValue {

  //TODO : required PlatformGridAPI and cloudDesktopInfoService not migrated yet. 

}
