/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject, Input} from '@angular/core';
import {IDialogErrorInfo, UiCommonMessageBoxService} from '@libs/ui/common';
import {MaterialSearchScope} from '../../model/material-search-scope';
import {IMaterialSearchError} from '../../model/interfaces/material-search-error.interface';

/**
 * Show current page of material
 */
@Component({
  selector: 'basics-shared-material-search-list',
  templateUrl: './material-search-list.component.html',
  styleUrls: ['./material-search-list.component.scss']
})
export class BasicsSharedMaterialSearchListComponent {
  private msgBoxService = inject(UiCommonMessageBoxService);

  /**
   * Search scope
   */
  @Input()
  public scope!: MaterialSearchScope;

  /**
   * Show material search error dialog
   * @param error
   */
  public showError(error: IMaterialSearchError) {
    this.msgBoxService.showErrorDialog(error.Exception as IDialogErrorInfo);
  }
}
