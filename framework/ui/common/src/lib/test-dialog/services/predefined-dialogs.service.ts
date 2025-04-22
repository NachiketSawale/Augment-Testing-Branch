/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';

import { ISelectOptions, getSelectDropdownOptionsToken } from '../models/select-options.interface';

import { EntityRuntimeData } from '@libs/platform/data-access';
import { FieldType } from '../../model/fields';

import { UiCommonSelectDialogOptionsComponent } from '../components/select-dialog-options/select-dialog-options.component';

import { IFormConfig } from '../../form';
import { DialogDetailsType, ICustomDialogOptions, IDialogErrorInfo, IMessageBoxOptions, IYesNoDialogOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonFormDialogService, UiCommonInputDialogService, UiCommonMessageBoxService } from '../../dialogs';

/**
 * test form entity interface.
 */
interface ITestFormEntity {
  myText: string;
  isGood?: boolean;
  money?: number;
}

/**
   * test dialog dropdown options.
   */
export const testdialogDropdownOptions: ISelectOptions[] = [
  { id: 1, displayName: 'Don\'t show again' },
];


@Injectable({
  providedIn: 'root'
})

/**
 * Used to implement predefined dialog from the framework.
 */
export class UiCommonPredefinedDialogsService {

  /**
   * test form controls data.
   */
  private testFormEntity: ITestFormEntity = {
    myText: 'Will has said good-bye.',
    isGood: true,

  };


  /**
   * test form runtime data.
   */
  private testFormRuntimeInfo: EntityRuntimeData<ITestFormEntity> = {
    readOnlyFields: [
      {
        field: 'isGood',
        readOnly: true,
      },
    ],
    validationResults: [
      {
        field: 'myText',
        result: {
          valid: false,
          error: 'I dont like this!',
        },
      },
    ],
    entityIsReadOnly: false
  };

  /**
   * test form config.
   */
  private testFormConfig: IFormConfig<ITestFormEntity> = {
    formId: 'first-test-form',
    showGrouping: false,
    groups: [
      {
        groupId: 'default',
        header: { text: 'Default Group' },
      },
    ],
    rows: [
      {
        groupId: 'default',
        id: 'isoCode1',
        label: {
          text: 'Iso Code 1',
        },
        type: FieldType.Description,
        model: 'myText',
        sortOrder: 2,
        required: true,
      },
      {
        groupId: 'default',
        id: 'isGood',
        label: {
          text: 'It is good',
        },
        type: FieldType.Boolean,
        model: 'isGood',
        sortOrder: 5,
      },
      {
        groupId: 'default',
        id: 'money',
        label: {
          text: 'Please transfer immediately',
        },
        type: FieldType.Money,
        minValue: 10,
        model: 'money',
        sortOrder: 7,
        required: true,
      }
    ],
  };

  /**
   * used to inject message-box service.
   */
  private readonly messageBoxService = inject(UiCommonMessageBoxService);

  /**
   * used to inject input-dialog service.
   */
  private readonly inputDialogService = inject(UiCommonInputDialogService);

  /**
   * used to inject form-dialog service.
   */
  private formDialogService = inject(UiCommonFormDialogService);

  /**
   * used to inject modal-dialog service.
   */
  private modalDialogService = inject(UiCommonDialogService);


  /**
   * Display selected dailog based on id.
   * @param {number} id id of selected dialog option. 
   */
  public displaySelectedDialog(id: number) {
    switch (id) {
      case 1:
        this.clickDontShowAgainDialog();
        break;
      case 2:
        this.clickInfoBox();
        break;
      case 3:
        this.clickDeletedSelectionModalDialog();
        break;
      case 4:
        this.clickYesNoDailog();
        break;
      case 5:
        this.clickInputDialog();
        break;
      case 6:
        this.clickMessageBox();
        break;
      case 7:
        this.clickInfoBoxWithDontShowAgainTrue();
        break;
      case 8:
        this.clickDetailMsgDialog();
        break;
      case 9:
        this.clickFormDialog();
        break;
      case 10:
        this.clickComponentTestDialog();
        break;
    }
  }

  /**
   * Display selected error dialog based on id.
   * @param {number} id id of selected error dialog.
   */
  public displaySelectedErrorDialog(id: number) {
    switch (id) {
      case 1:
        this.clickErrorInfoDialog();
        break;
      case 2:
        this.clickBusinessLayerExceptionErrorDialog();
        break;
    }

  }


  /**
   * displays dialog for information message.
   */
  public clickInfoBox() {
    this.messageBoxService.showInfoBox('Hello, this is a simply info box.', 'info', false);
  }

  /**
   * displays dialog for information message along with dontShowAgain
   */
  public clickInfoBoxWithDontShowAgainTrue() {
    this.messageBoxService.showInfoBox('This is a infobox.', 'myDialogId', true);

  }

  /**
   * Used to show a dialog to delete a selection.
   */
  public clickDeletedSelectionModalDialog() {
    this.messageBoxService.deleteSelectionDialog();
  }


  /**
   * Used to show a dialog box with Yes/No buttons based 
   * on a configuration object.
   */
  public async clickYesNoDailog() {
    const headerTexttr = 'Question';
    const bodyTextKeytr = 'Do you want some Tea?';
    const options: IYesNoDialogOptions = {
      defaultButtonId: StandardDialogButtonId.No,
      id: 'YesNoModal',
      dontShowAgain: true,
      showCancelButton: true,
      headerText: headerTexttr,
      bodyText: bodyTextKeytr,
    };
    await this.messageBoxService.showYesNoDialog(options);

  }


  /**
   * Used to display a standard dialog for input.
   */
  public async clickInputDialog() {
    const options = {
      headerText: 'Example Title',
      bodyText: 'Please Enter 4 numbers',
      pattern: '^\\d{4}$',
      width: '30%',
      maxLength: 16,
      type: 'text',
    };
    const result = await this.inputDialogService.showInputDialog(options);

    // console is added for testing purpose.
    console.log(result);
  }

  /**
   * Used to displays a standard message box with an 
   * Do not show again option as false.
   */
  public clickMessageBox() {
    this.messageBoxService.showMsgBox('This is only a test message box.', 'Message', 'ico-info', 'message', false);

  }

  /**
   * Used to display form dialog.
   */
  public async clickFormDialog() {
    const result = await this.formDialogService.showDialog<ITestFormEntity>({
      id: 'test-form',
      headerText: 'Example Form Dialog',
      formConfiguration: this.testFormConfig,
      entity: this.testFormEntity,
      runtime: this.testFormRuntimeInfo,
      customButtons: [],
      topDescription: 'This is a dialog for testing the form dialog service',
    });

    // console is added for testing purpose. 
    console.log(result);
  }


  /**
   * Used to display detail message box.
   */
  public async clickDetailMsgDialog() {
    const options: IMessageBoxOptions = {
      headerText: 'Detail Box (Longtext)',
      bodyText: 'This is just a test dialog to show the Detail Box. The detail area contains a grid with further info.',
      details: {
        show: true,
        type: DialogDetailsType.LongText,
        value: `
				<div id='example1'>
				  <h1>Lorem Ipsum Dolor</h1>
				  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
				  <p>Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>
				`,
        cssClass: 'longtext',
      },
      buttons: [
        {
          id: StandardDialogButtonId.Ok
        },
      ],
      customButtons: []
    };
    this.messageBoxService.showMsgBox(options);

  }


  /**
   * Used to display dialog with dontShowAgain dialog.
   */
  public clickDontShowAgainDialog() {
    const headerText = 'Example Header Text';
    const bodyText = 'This is an example not translated body text.';
    this.messageBoxService.showMsgBox(bodyText, headerText, 'ico-info', 'message', false);
  }


  /**
   * Used to display error info dialog
   */
  public clickErrorInfoDialog() {
    const obj: IDialogErrorInfo = {
      errorCode: 1,
      errorVersion: '5.1.0-2021-08-09@5.1.x.x',
      errorMessage: 'Could not find a part of the path `D:\\Entwicklung\\Test Codes\\Backend Fehlermeldung Test\\response.txt`.',
      errorDetail: 'Could not find a part of the path `D:\\Entwicklung\\Test Codes\\Backend Fehlermeldung Test\\response.txt`.',
      detailStackTrace:
        '<li>Could not find a part of the path `D:\\Entwicklung\\Test Codes\\Backend Fehlermeldung Test\\response.txt`.</li>\r\n<ul>\r\n<li>   at Microsoft.Win32.SafeHandles.SafeFileHandle.CreateFile(String fullPath, FileMode mode, FileAccess access, FileShare share, FileOptions options)</li>\r\n<li>\n   at Microsoft.Win32.SafeHandles.SafeFileHandle.Open(String fullPath, FileMode mode, FileAccess access, FileShare share, FileOptions options, Int64 preallocationSize)</li>\r\n<li>\n   at System.IO.Strategies.OSFileStreamStrategy..ctor(String path, FileMode mode, FileAccess access, FileShare share, FileOptions options, Int64 preallocationSize)</li>\r\n<li>\n   at System.IO.FileStream..ctor(String path, FileMode mode, FileAccess access, FileShare share, Int32 bufferSize, FileOptions options)</li>\r\n<li>\n   at System.IO.StreamReader.ValidateArgsAndOpenPath(String path, Encoding encoding, Int32 bufferSize)</li>\r\n<li>\n   at System.IO.StreamReader..ctor(String path, Encoding encoding, Boolean detectEncodingFromByteOrderMarks, Int32 bufferSize)</li>\r\n<li>\n   at System.IO.StreamReader..ctor(String path)</li>\r\n<li>\n   at RIB.Visual.Cloud.Desktop.ServiceFacade.WebApi.Controllers.TestController.ThrowSomething()</li>\r\n<li>\n   at lambda_method113252(Closure , Object , Object[] )</li>\r\n<li>\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ActionMethodExecutor.SyncObjectResultExecutor.Execute(IActionResultTypeMapper mapper, ObjectMethodExecutor executor, Object controller, Object[] arguments)</li>\r\n<li>\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.InvokeActionMethodAsync()</li>\r\n<li>\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Next(State& next, Scope& scope, Object& state, Boolean& isCompleted)</li>\r\n<li>\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.InvokeNextActionFilterAsync()</li>\r\n<li>\n--- End of stack trace from previous location ---</li>\r\n<li>\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Rethrow(ActionExecutedContextSealed context)</li>\r\n<li>\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Next(State& next, Scope& scope, Object& state, Boolean& isCompleted)</li>\r\n<li>\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.InvokeInnerFilterAsync()</li>\r\n<li>\n--- End of stack trace from previous location ---</li>\r\n<li>\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextExceptionFilterAsync>g__Awaited|26_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)</li>\r\n\r\n</ul>\r\n',
      detailMethod: null,
      detailMessage: '',
    };
    this.messageBoxService.showErrorDialog(obj);
  }


  /**
   * Used to display BusinessLayerExceptionErrorDialog.
   */
  public clickBusinessLayerExceptionErrorDialog() {
    const obj: IDialogErrorInfo = {
      errorCode: 1,
      errorVersion: '5.1.0-2021-08-09@5.1.x.x',
      errorMessage: 'Loading the settings was not successful. Please try again or contact your administrator.',
      errorDetail: 'Any technical text: Exception 2 - Text could not be read from the file.',
      detailStackTrace: '<li>Exception 2 - Text could not be read from the file.</li>\r\n<ul>\r\n<li>   at RIB.Visual.Cloud.Desktop.ServiceFacade.WebApi.Controllers.TestController.ThrowSomething2()</li>\r\n\r\n</ul>\r\n<li>Exception 1 (Causing Exception) - File not found.</li>\r\n<ul>\r\n<li>   at RIB.Visual.Cloud.Desktop.ServiceFacade.WebApi.Controllers.TestController.ThrowSomething2()</li>\r\n\r\n</ul>\r\n',
      detailMethod: null
    };
    this.messageBoxService.showErrorDialog(obj);
  }


  /**
   * Used to display test dialog with component.
   */
  public async clickComponentTestDialog() {
    const modalOptions: ICustomDialogOptions<ISelectOptions, UiCommonSelectDialogOptionsComponent> = {
      buttons: [{
        id: 'ok',
        isDisabled: info => {
          return !info.dialog.value || info.dialog.value.id === 0;
        }
      },
      { id: 'cancel', caption: { key: 'ui.common.dialog.cancelBtn' } }
      ],
      headerText: 'Component Test',
      width: '700px',
      id: 'choosedDialog',
      bodyComponent: UiCommonSelectDialogOptionsComponent,
      bodyProviders: [{ provide: getSelectDropdownOptionsToken(), useValue: testdialogDropdownOptions }],
      value: {
        id: 0,
        displayName: ''
      }

    };
    await this.modalDialogService.show(modalOptions);

  }

}
