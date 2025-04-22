/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';

import { ISelectOptions, getSelectDropdownOptionsToken } from '../models/select-options.interface';
import { ICustomDialogOptions, IEditorDialogResult, IFormDialogConfig, StandardDialogButtonId, UiCommonDialogService, UiCommonFormDialogService } from '../../dialogs';
import { ITestEntity } from '../models/test-entity.interface';
import { IEntityContext } from '@libs/platform/common';
import { IFormConfig } from '../../form';

import { UiCommonPredefinedDialogsService, testdialogDropdownOptions } from './predefined-dialogs.service';

import { EntityRuntimeData } from '@libs/platform/data-access';
import { FieldType, createLookup } from '../../model/fields';
import { CodemirrorLanguageModes } from '../../model/script/codemirror-language-modes.enum';

import { UiCommonSelectDialogOptionsComponent } from '../components/select-dialog-options/select-dialog-options.component';

import { CountryEntity, UiCommonCountryLookupService } from '../../lookup';


@Injectable({
  providedIn: 'root'
})

/**
 * Service to display dialog which contains every domain control
 * and predefined dialogs for test purposes.
 */
export class CloudDesktopTestService {
  /**
   * predefined dialogs dropdown options
   */
  public dialogDropdownOptions: ISelectOptions[] = [
    { id: 1, displayName: 'Don\'t show again' },
    { id: 2, displayName: 'Info Box' },
    { id: 3, displayName: 'Delete Selection' },
    { id: 4, displayName: 'Yes No Dialog' },
    { id: 5, displayName: 'Input Dialog' },
    { id: 6, displayName: 'Messagebox' },
    { id: 7, displayName: 'Info Box' },
    { id: 8, displayName: 'Detail Box (Longtext)' },
    { id: 9, displayName: 'Example Form Dialog' },
    { id: 10, displayName: 'Component Test' },
  ];

  /**
   * predefined error-dialogs dropdown options
   */
  public errorDialogDropdownOptions: ISelectOptions[] = [
    { id: 1, displayName: 'local error read from a text file to inject a reported exception' },
    { id: 2, displayName: 'Nested Business Layer Exception' }
  ];


  /**
   * used to inject predefined dialog service.
   */
  private predefinedDialogService = inject(UiCommonPredefinedDialogsService);

  /**
   * Dialog form config service.
   */
  private formDialogService = inject(UiCommonFormDialogService);


  /**
   * Used to inject dialog service.
   */
  private modalDialogService = inject(UiCommonDialogService);



  /**
   * Demo first form controls data.
   */
  private testFormEntity: ITestEntity = {
    description: '',
    decimal: 0,
    money: 0,
    imperialFt: 0,
    quantity: 0,
    exchangeRate: 0,
    factor: 0
  };

  /**
   * Demo first form runtime data.
   */
  private testFormRuntimeInfo: EntityRuntimeData<ITestEntity> = {
    readOnlyFields: [],
    validationResults: [],
    entityIsReadOnly: false
  };

  /**
   * This shows a dialog which contains every domain control for test purposes
   * @returns {Promise<IEditorDialogResult<ITestEntity>> | undefined}
   * result of the dialog
   */
  public showControlTestDialog(): Promise<IEditorDialogResult<ITestEntity>> | undefined {
    let readOnlyState: boolean = false;

    const formConfig: IFormConfig<ITestEntity> = this.createFormConfig();

    const formDialogOptions: IFormDialogConfig<ITestEntity> = {
      width: '60%',
      height: '90%',
      formConfiguration: formConfig,
      headerText: 'Test Dialog',
      topDescription: 'This is a dialog for testing various controls made by Germanys UI Team.',
      customButtons: [
        {
          id: 'readonly',
          caption: 'Set Readonly',
          fn: (event, info) => {

            readOnlyState = !readOnlyState;
            formConfig.rows.forEach((row) => {
              row.readonly = !row.readonly;
            });
            formDialogOptions.customButtons?.forEach((btn) => {
              if (btn.id === 'readonly') {
                btn.caption = readOnlyState ? 'Unset Read Only' : 'Set Read Only';
              }
            });
          }

        },
        {
          id: 'dialog',
          caption: 'Show Custom Dialog',
          fn: () => {
            this.showCustomDialog();
          }
        },
        {
          id: 'error',
          caption: 'Show Error',
          fn: () => {
            this.showErrorDialogOptions();
          }
        }
      ],
      entity: this.testFormEntity,
      runtime: this.testFormRuntimeInfo

    };

    return this.formDialogService.showDialog(formDialogOptions);
  }

  /**
   * This shows a custom test dialog with all predefined dialog
   * options.
   */
  public async showCustomDialog() {
    const modalOptions: ICustomDialogOptions<ISelectOptions, UiCommonSelectDialogOptionsComponent> = {
      buttons: [{
        id: 'ok',
        isDisabled: info => {
          return !info.dialog.value || info.dialog.value.id === 0;
        }
      },
      {
        id: 'cancel',
        caption: { key: 'ui.common.dialog.cancelBtn' },
      }
      ],
      headerText: 'Choose Dialog ',
      width: '60%',
      id: 'choosedDialog',
      bodyComponent: UiCommonSelectDialogOptionsComponent,
      bodyProviders: [{ provide: getSelectDropdownOptionsToken(), useValue: this.dialogDropdownOptions }],
      value: {
        id: 0,
        displayName: ''
      }

    };
    const result = await this.modalDialogService.show(modalOptions);

    if (result?.closingButtonId === StandardDialogButtonId.Ok && result?.value?.id) {
      this.predefinedDialogService.displaySelectedDialog(result?.value?.id);
    }

  }


  /**
   * This displays error dialog options.
   */
  public async showErrorDialogOptions() {
    const modalOptions: ICustomDialogOptions<ISelectOptions, UiCommonSelectDialogOptionsComponent> = {
      buttons: [{
        id: 'ok',
        isDisabled: info => {
          return !info.dialog.value || info.dialog.value.id === 0;
        }
      },
      { id: 'cancel', caption: { key: 'ui.common.dialog.cancelBtn' } }
      ],
      headerText: 'Choose Dialog ',
      width: '60%',
      id: 'choosedDialog',
      bodyComponent: UiCommonSelectDialogOptionsComponent,
      bodyProviders: [{ provide: getSelectDropdownOptionsToken(), useValue: this.errorDialogDropdownOptions }],
      value: {
        id: 0,
        displayName: ''
      }

    };
    const result = await this.modalDialogService.show(modalOptions);

    if (result?.closingButtonId === StandardDialogButtonId.Ok && result?.value?.id) {
      this.predefinedDialogService.displaySelectedErrorDialog(result?.value?.id);
    }

  }


  /**
   * Used to create form configuration data.
   * @returns {IFormConfig<ITestEntity>} form config data
   */
  public createFormConfig(): IFormConfig<ITestEntity> {
    return {
      formId: 'cloud.desktop.uds.form',
      showGrouping: false,
      groups: [{
        groupId: 'config',
        open: true,
        visible: true,
        sortOrder: 1,
      }],
      rows:
        [
          {
            groupId: 'config',
            id: 'myFile',
            label: {
              text: 'fileselect',
            },
            type: FieldType.FileSelect,
            model: 'myFile',
            sortOrder: 1,
            options: {
              fileFilter: 'image/*',
              multiSelect: true,
              retrieveFile: true,
            },
          },
          {
            groupId: 'config',
            type: FieldType.Composite,
            id: 'composite',
            label: 'composite',
            composite: [
              {
                id: 'valid',
                label: {
                  text: 'Is Valid',
                },
                type: FieldType.Boolean,
                model: 'isValid',
                sortOrder: 1,
                required: true,
              },
              {
                id: 'present',
                label: {
                  text: 'Is Present',
                },
                type: FieldType.Boolean,
                model: 'isPresent',
                sortOrder: 2,
              },
              {
                id: 'myFile',
                label: {
                  text: 'Upload File',
                },
                type: FieldType.FileSelect,
                model: 'dataFile',
                sortOrder: 3,
                options: {
                  fileFilter: 'image/*',
                  multiSelect: true,
                  retrieveFile: true,
                },
              },
            ],
            sortOrder: 2,
          },
          {
            groupId: 'config',
            id: 'remark',
            label: {
              text: 'remark',
            },
            type: FieldType.Remark,
            model: 'remark',
            sortOrder: 3,
          },
          {
            groupId: 'config',
            id: 'url',
            label: {
              text: 'url',
            },
            type: FieldType.Url,
            model: 'url',
            sortOrder: 4,
          },
          {
            groupId: 'config',
            id: 'description',
            label: {
              text: 'description',
            },
            type: FieldType.Description,
            model: 'description',
            sortOrder: 5,
          },
          {
            groupId: 'config',
            id: 'comment',
            label: {
              text: 'comment',
            },
            type: FieldType.Comment,
            model: 'comment',
            sortOrder: 6,
          },
          {
            groupId: 'config',
            id: 'script',
            label: {
              text: 'script',
            },
            type: FieldType.Script,
            model: 'script',
            sortOrder: 29,
            editorOptions: {
              readOnly: false,
              multiline: true,
              languageMode: CodemirrorLanguageModes.JavaScript,
              enableLineNumbers: true,
              enableBorder: true
            }
          },
          {
            groupId: 'config',
            id: 'lookup',
            label: 'lookup',
            type: FieldType.Lookup,
            model: 'lookup',
            sortOrder: 7,
            lookupOptions: createLookup<ITestEntity, CountryEntity>({
              dataServiceToken: UiCommonCountryLookupService,
              clientSideFilter: {
                execute(item: CountryEntity, entity: IEntityContext<ITestEntity>): boolean {
                  return true;
                },
              },
              showDescription: true,
              descriptionMember: 'Iso2',
            }),
          },
          {
            groupId: 'config',
            id: 'integer',
            label: {
              text: 'integer',
            },
            type: FieldType.Integer,
            model: 'integer',
            sortOrder: 8,
          },
          {
            groupId: 'config',
            id: 'decimal',
            label: {
              text: 'decimal',
            },
            type: FieldType.Decimal,
            model: 'decimal',
            sortOrder: 9,
          },
          {
            groupId: 'config',
            id: 'imperialFt',
            label: {
              text: 'imperialFt',
            },
            type: FieldType.ImperialFt,
            model: 'imperialFt',
            sortOrder: 10,
          },
          {
            groupId: 'config',
            id: 'quantity',
            label: {
              text: 'quantity',
            },
            type: FieldType.Quantity,
            model: 'quantity',
            sortOrder: 11,
          },
          {
            groupId: 'config',
            id: 'exchangeRate',
            label: {
              text: 'exchangeRate',
            },
            type: FieldType.ExchangeRate,
            model: 'exchangeRate',
            sortOrder: 12,
          },
          {
            groupId: 'config',
            id: 'factor',
            label: {
              text: 'factor',
            },
            type: FieldType.Factor,
            model: 'factor',
            sortOrder: 13,
          },
          {
            groupId: 'config',
            id: 'color',
            label: {
              text: 'Color',
            },
            type: FieldType.Color,
            model: 'color',
            showClearButton: true,
            infoText: 'Color',
            sortOrder: 14,
          },
          {
            groupId: 'config',
            id: 'code',
            label: {
              text: 'Code',
            },
            type: FieldType.Code,
            model: 'code',
            maxLength: 30,
            sortOrder: 15,
          },
          {
            groupId: 'config',
            id: 'history',
            label: {
              text: 'history',
            },
            type: FieldType.History,
            model: 'history',
            sortOrder: 16,
          },
          {
            groupId: 'config',
            id: 'email',
            label: {
              text: 'email',
            },
            type: FieldType.Email,
            model: 'email',
            sortOrder: 17,
          },
          {
            groupId: 'config',
            id: 'password',
            label: {
              text: 'password',
            },
            type: FieldType.Password,
            model: 'password',
            sortOrder: 18,
          },
          {
            groupId: 'config',
            id: 'iban',
            label: {
              text: 'iban',
            },
            type: FieldType.Iban,
            model: 'iban',
            sortOrder: 19,
          },
          {
            groupId: 'config',
            id: 'durationSec',
            label: {
              text: 'durationSec',
            },
            type: FieldType.DurationSec,
            model: 'durationSec',
            sortOrder: 20,
          },
          {
            groupId: 'config',
            id: 'money',
            label: {
              text: 'money',
            },
            type: FieldType.Money,
            model: 'money',
            sortOrder: 21,
          },
          {
            groupId: 'config',
            id: 'date',
            label: {
              text: 'date',
            },
            type: FieldType.Date,
            model: 'date',
            sortOrder: 22,
          },
          {
            groupId: 'config',
            id: 'boolean',
            label: {
              text: 'boolean',
            },
            type: FieldType.Boolean,
            model: 'boolean',
            sortOrder: 23,
          },
          {
            groupId: 'config',
            id: 'select',
            label: 'select',
            type: FieldType.Select,
            model: 'select',
            sortOrder: 24,
            itemsSource: {
              items: [
                { id: 1, displayName: 'Eintrag 1' },
                { id: 2, displayName: 'Eintrag 2' },
                { id: 3, displayName: 'Eintrag 3' }
              ],
            },
          },
          {
            groupId: 'config',
            id: 'inputSelect',
            label: 'Input select',
            type: FieldType.InputSelect,
            model: 'inputSelect',
            options: {
              items: [
                {
                  description: 'Q1 2015',
                  id: 1,
                  isLive: true,
                  remark: 'Q1 2015',
                  sorting: 1,
                  version: 1,
                },
                {
                  description: 'Q2 2015',
                  id: 2,
                  isLive: true,
                  remark: 'Q2 2015',
                  sorting: 2,
                  version: 2,
                },
                {
                  description: 'Q3 2015',
                  id: 3,
                  isLive: true,
                  remark: 'Q3 2015',
                  sorting: 3,
                  version: 1,
                },
              ],
              serviceName: 'schedulingLookupBaselineSpecificationDataService',
              inputDomain: 'Description',
            },
            sortOrder: 25
          },
          {
            groupId: 'config',
            id: 'customTranslate',
            label: {
              text: 'Custom Translate',
            },
            type: FieldType.CustomTranslate,
            model: 'customTranslate',
            sortOrder: 26,
            options: {
              section: 'testSection',
              id: 'testId',
              name: 'testName',
              onInitiated: (info) => {
                console.log(info);
              },
              onTranslationChanged: (info) => {
                console.log(info);
              },
              cacheEnabled: false,
            },
          },
          {
            groupId: 'config',
            id: 'radio',
            label: 'radio',
            type: FieldType.Radio,
            model: 'radio',
            sortOrder: 27,
            itemsSource: {
              items: [
                {
                  id: 1,
                  displayName: 'Portrait',
                  iconCSS: 'tlb-icons ico-info',
                },
                {
                  id: 2,
                  displayName: 'Landscape',
                  iconCSS: 'tlb-icons ico-info',
                },
                {
                  id: 3,
                  displayName: 'Picture',
                  iconCSS: 'tlb-icons ico-info',
                },
              ],
            },
          },
          {
            groupId: 'config',
            id: 'customComponent',
            model: 'customComponent',
            label: {
              text: 'customComponent'
            },
            type: FieldType.CustomComponent,
            componentType: UiCommonSelectDialogOptionsComponent,
            providers: [{ provide: getSelectDropdownOptionsToken(), useValue: testdialogDropdownOptions }],
            sortOrder: 28,
          }
        ]
    };
  }

}
