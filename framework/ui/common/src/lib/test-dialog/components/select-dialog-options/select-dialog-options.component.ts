/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';


import { ISelectOptions, getSelectDropdownOptionsToken } from '../../models/select-options.interface';
import { getCustomDialogDataToken } from '../../../dialogs';

/**
 * TODO: This component will be remove once select domain control issue
 * resolved.
 */

@Component({
  selector: 'ui-common-select-dialog-options',
  templateUrl: './select-dialog-options.component.html',
  styleUrl: './select-dialog-options.component.scss'
})

/**
 * Component used to display select dropdown with provided options.
 */

export class UiCommonSelectDialogOptionsComponent {
  /**
     * dialog options
     */
  public modalDialogsOptions = inject(getSelectDropdownOptionsToken());


  /**
   * Dialog reference data.
   */
  private readonly dialogWrapper = inject(getCustomDialogDataToken<ISelectOptions, UiCommonSelectDialogOptionsComponent>());


  /**
   * Used to get selected dialog option data from dropdown.
   * @param {string} event selected option data 
   */
  public change(event: string) {
    this.dialogWrapper.value = this.modalDialogsOptions[parseInt(event) - 1];
  }

}
