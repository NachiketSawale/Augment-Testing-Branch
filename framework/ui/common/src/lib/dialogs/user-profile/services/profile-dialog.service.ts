/*
 * Copyright(c) RIB Software GmbH
 */

interface IProfileEntity {
  value: string;
  profile: string;
}

import { inject, Injectable } from '@angular/core';
import { IFormConfig } from '../../../form';
import { FieldType } from '../../../model/fields';
import { UiCommonFormDialogService } from '../../form';
import { IDialog, IDialogOptions } from '../../base';

@Injectable({
  providedIn: 'root'
})

/**
* Service for user-profile dialog
*/
export class UiCommonProfileDialogService {
  private readonly formDialogService = inject(UiCommonFormDialogService);

  /**
   * Entity Configuration
   */
  public entity: IProfileEntity = {
    value: 'User',
    profile: '',
  };

  /**
   * Common function to open profile dialog
   */
  public async showSaveProfileAsDialog<TDetailsBody extends IDialog<void>>(customModalOptions: IDialogOptions<TDetailsBody>): Promise<void> {
    await this.formDialogService.showDialog<IProfileEntity>({
      id: 'profileDialog',
      headerText: customModalOptions.headerText ? customModalOptions.headerText : '',
      formConfiguration: this.formConfig,
      entity: this.entity,
      runtime: undefined,
    });
  }

  private readonly formConfig: IFormConfig<IProfileEntity> = {
    formId: 'profile',
    rows: [
      {
        id: 'mode',
        label: ' ',
        type: FieldType.Select,
        model: 'value',
        sortOrder: 1,
        itemsSource: {
          items: [
            {
              id: 2,
              displayName: 'User',
            },
            {
              id: 3,
              displayName: 'System',
            },
          ],
        },
      },

      {
        groupId: 'profile-group',
        id: 'profile',
        label: {
          text: 'basics.common.dialog.saveProfile.labelProfileName',
        },
        type: FieldType.Description,
        model: 'profile',
        sortOrder: 2,
        placeholder: 'basics.common.dialog.saveProfile.placeholderProfileName',
      },

    ],
  };
}