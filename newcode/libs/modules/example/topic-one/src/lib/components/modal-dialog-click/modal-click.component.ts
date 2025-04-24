/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import {
	DialogDetailsType,
	ICustomDialogOptions,
	IDialogErrorInfo,
	IMessageBoxOptions,
	IYesNoDialogOptions,
	StandardDialogButtonId,
	UiCommonDialogService,
	UiCommonInputDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { AlertComponent } from '../modal-dialog-body/alert/alert.component';
import { ChangePasswordComponent } from '../modal-dialog-body/changepassword/changepassword.component';
import { SaveComponent } from '../modal-dialog-body/save/save.component';
import { ContainerBaseComponent } from '@libs/ui/container-system';

/**
 * This class creates the component dynamically depending upon selected dialog value.
 * This component is created for demo purpose just for opening the modal popup.
 */
@Component({
	selector: 'example-topic-one-modal-click',
	templateUrl: './modal-click.component.html',
	styleUrls: ['./modal-click.component.css'],
})
export class ModalClickComponent extends ContainerBaseComponent {
	public dropdown = [
		{ value: 'Options', name: 'options', id: 'options' },
		{ value: 'Save', name: 'save', id: 'Save' },
		{ value: 'ChangePassword', name: 'changepassword', id: 'changepassword' },
		{ value: 'TDBD', name: 'tdbd', id: 'tdbd' },
		{ value: 'ErrorDialog', name: 'errordialog', id: 'errordialog' },
		{ value: 'DetailMsgBox', name: 'detailmsgbox', id: 'detailmsgbox' },
		{ value: 'SimpleMsgBox', name: 'simplemsgbox', id: 'simplemsgbox' },
		{ value: 'InfoBox', name: 'infobox', id: 'infobox' },
		{ value: 'InputDialog', name: 'inputdialog', id: 'inputdialog' },
		{ value: 'YesNoDialog', name: 'YesNoDialog', id: 'YesNoDialog' },
		{ value: 'DeleteSelectionDialog', name: 'DeleteSelectionDialog', id: 'DeleteSelectionDialog' },
	];

	public constructor(private modalDialogService: UiCommonDialogService) {
		super();
	}

	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	private readonly inputDialogService = inject(UiCommonInputDialogService);

	/**
	 * This function creates the object containing the modal dialog meta data and also
	 * creates the modal component dynamically depending upon selected value.
	 *
	 * @param {string} event
	 */
	public async change(event: string): Promise<void> {
		if (event === 'Save') {
			this.clickSaveDialog(event);
		} else if (event === 'ChangePassword') {
			this.clickChangePasswordDialog(event);
		} else if (event === 'TDBD') {
			this.clickAlertDialog(event);
		} else if (event === 'ErrorDialog') {
			this.clickErrorDialog();
		} else if (event === 'DetailMsgBox') {
			this.clickDetailMsgDialog();
		} else if (event === 'SimpleMsgBox') {
			const result = await this.messageBoxService.showMsgBox('This is simple Message Box', 'Message', 'ico-info', 'message', false);
			//TODO: Operations to be done on the result object
			console.log(result);
		} else if (event === 'InfoBox') {
			const result = await this.messageBoxService.showInfoBox('This is Just Information', 'info', true);
			//TODO: Operations to be done on the result object
			console.log(result);
		} else if (event === 'InputDialog') {
			this.clickInputDialog();
		} else if (event === 'YesNoDialog') {
			this.clickYesNoModalDailog();
		} else if (event === 'DeleteSelectionDialog') {
			this.clickDeletedSelectionModalDialog();
		}
	}

	public async clickSaveDialog(event: string) {
		const modalOptions: ICustomDialogOptions<{ text: string }, SaveComponent> = {
			width: '60%',
			buttons: [{ id: StandardDialogButtonId.Ok }, { id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } }],
			customButtons: [
				{ id: 'delete', caption: { key: 'ui.common.dialog.deleteBtn' }, isDisabled: true },
				{
					id: 'default',
					caption: { key: 'ui.common.dialog.defaultButton' },
					isDisabled: true,
					autoClose: true,
					fn: (event, info) => {
						console.log(info);
						return undefined;
					},
				},
			],
			headerText: 'Save',
			id: event,
			value: { text: 'save dialog' },
			bodyComponent: SaveComponent,
		};
		const result = await this.modalDialogService.show(modalOptions);
		//TODO: Operations to be done on the result object
		console.log(result);
	}

	public async clickChangePasswordDialog(event: string) {
		const modalOptions = {
			width: '40%',
			buttons: [
				{
					id: 'changepassword',
					caption: { key: 'ui.common.dialog.changePwdBtn' },
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'ui.common.dialog.cancelBtn' },
				},
			],
			headerText: 'Change Password',
			id: event,
			bodyComponent: ChangePasswordComponent,
		};
		const result = await this.modalDialogService.show(modalOptions);
		//TODO: Operations to be done on the result object
		console.log(result);
	}

	public async clickAlertDialog(event: string) {
		const modalOptions = {
			width: '30%',
			resizeable: true,
			headerText: 'Alert',
			id: event,
			showCloseButton: false,
			bodyComponent: AlertComponent,
			topDescription: {
				iconClass: 'ico-info',
				text: 'This is Top Description!',
			},
			bottomDescription: { text: 'This is Bottom Description' },
		};
		const result = await this.modalDialogService.show(modalOptions);
		//TODO: Operations to be done on the result object
		console.log(result);
	}

	public async clickErrorDialog() {
		const obj: IDialogErrorInfo = {
			errorCode: 1,
			errorVersion: '5.1.0-2021-08-09@5.1.x.x',
			errorMessage: 'Template file not found.',
			errorDetail:
				'   at RIB.Visual.Reporting.Platform.BusinessComponents.FastReportService.CheckReportAccess(String reportPath, String reportsRoot)<br>   at RIB.Visual.Reporting.Platform.BusinessComponents.FastReportService.PrepareReport(ICommunicationData communicationData, IReportConfiguration configuration)<br>   at RIB.Visual.Reporting.Platform.BusinessComponents.ReportLogic.PrepareReport(ReportData reportData, GearData gearData, IParameterOptionDataKeyValuePairData[] parameters)',
			detailStackTrace:
				'<li>Template file not found.</li>\r\n<ul>\r\n<li>   at RIB.Visual.Reporting.Platform.BusinessComponents.FastReportService.CheckReportAccess(String reportPath, String reportsRoot)</li>\r\n<li>\n   at RIB.Visual.Reporting.Platform.BusinessComponents.FastReportService.PrepareReport(ICommunicationData communicationData, IReportConfiguration configuration)</li>\r\n<li>\n   at RIB.Visual.Reporting.Platform.BusinessComponents.ReportLogic.PrepareReport(ReportData reportData, GearData gearData, IParameterOptionDataKeyValuePairData[] parameters)</li>\r\n\r\n</ul>\r\n',
			detailMethod: null,
			detailMessage: '',
		};
		const result = await this.messageBoxService.showErrorDialog(obj);
		//TODO: Operations to be done on the result object
		console.log(result);
	}

	public async clickDetailMsgDialog() {
		const options: IMessageBoxOptions = {
			headerText: 'Detail Message Box',
			bodyText: 'This is shorthand for detailed message',
			details: {
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
		const result = await this.messageBoxService.showMsgBox(options);
		//TODO: Operations to be done on the result object
		console.log(result);
	}

	public async clickInputDialog() {
		const options = {
			headerText: 'Input Context ID',
			bodyText: 'Please Enter A value',
			pattern: '[a-zA-Z ]*',
			width: '30%',
			maxLength: 20,
			type: 'text',
		};
		const result = await this.inputDialogService.showInputDialog(options);
		//TODO: Operations to be done on the result object
		console.log(result);
	}

	public async clickYesNoModalDailog() {
		const headerTexttr = 'Example Of Yes & No Dialog';
		const bodyTextKeytr = 'Shall we do crazy things?';
		const options: IYesNoDialogOptions = {
			defaultButtonId: StandardDialogButtonId.No,
			id: 'YesNoModal',
			dontShowAgain: true,
			showCancelButton: true,
			headerText: headerTexttr,
			bodyText: bodyTextKeytr,
		};
		const result = await this.messageBoxService.showYesNoDialog(options);
		//TODO: Operations to be done on the result object
		console.log(result);
	}

	public async clickDeletedSelectionModalDialog() {
		const result = await this.messageBoxService.deleteSelectionDialog();
		//TODO: Operations to be done on the result object
		console.log(result);
	}
}
