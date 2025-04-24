/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterContentChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject } from '@angular/core';

import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';

import { IFileSelectControlContext } from '../../model/file-select-control-context.interface';
import { IFileSelectControlResult } from '@libs/platform/common';
import { IFileSelectOptions } from '../../../model/fields/additional/file-select-options.interface';
import { UiCommonMessageBoxService } from '../../../..';

/**
 * Provides a means for the user to select a local file for upload.
 */
@Component({
	selector: 'ui-common-file-select',
	templateUrl: './file-select.component.html',
	styleUrls: ['./file-select.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileSelectComponent extends DomainControlBaseComponent<IFileSelectControlResult | IFileSelectControlResult[], IFileSelectControlContext> implements AfterViewInit, AfterContentChecked {
	/**
	 * This service creates the configuration object for modal dialog and also opens and closes modal dialog.
	 */
		//private readonly modalDialogService = inject(UiCommonDialogService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * Maximum file size permitted.
	 */
	private maxSize: string = '2MB';

	/**
	 * Names of the selected(valid) files.
	 */
	private name: string[] = [];

	/**
	 * A wrapper around a native element inside of a View.
	 */
	private readonly elementRef = inject(ElementRef);

	/**
	 * for manual change detection triggering
	 * @private
	 */
	private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
	}

	/**
	 * Initializes file select control.
	 */
	public ngAfterViewInit(): void {
		this.initFileSelectControl();
	}

	public ngAfterContentChecked(): void {
		this.cdr.detectChanges();
	}

	/**
	 * Initializes file select control data.
	 */
	private initFileSelectControl(): void {
		const formOptions = this.controlContext.options as IFileSelectOptions;
		this.maxSize = formOptions.maxSize ? formOptions.maxSize : this.maxSize;

		if (this.controlContext.value) {
			this.initFileData();
		}
	}

	/**
	 * Initializes file select control file data.
	 */
	private initFileData(): void {
		const names: string[] = [];

		if (Array.isArray(this.controlContext.value)) {
			this.controlContext.value.forEach((file) => {
				names.push(file.name as string);
			});
		} else {
			names.push((this.controlContext.value as IFileSelectControlResult).name);
		}

		this.name = names;
		this.elementRef.nativeElement.querySelector('[name=fileName]').textContent = this.name;
	}

	/**
	 * Method called upon file/files selection.
	 *
	 * @param {Event} event
	 */
	public async onFileSelected(event: Event): Promise<void> {
		this.name = [];
		const files = (<HTMLInputElement>event.target).files as FileList;
		const formOptions = this.controlContext.options;
		let fileSelectValue: IFileSelectControlResult[] = [];
		if (formOptions && !formOptions.multiSelect && files.length) {
			const value = await this.getSingleFileSelectData(files[0]);
			if (value) {
				this.controlContext.value = value;
				fileSelectValue.push(value);
			}
		} else if (formOptions && formOptions.multiSelect && files.length) {
			const value = await this.getMultiFileSelectData(files);
			if (value.length) {
				this.controlContext.value = value;
				fileSelectValue = fileSelectValue.concat(value);
			}
		} else {
			//TODO: Body text is kept static, will be replaced with translatable later on.
			const bodyText = 'Unexpected Error';
			this.openMsgBoxDialog(bodyText);
		}

		//Execute any callback for custom functionality
		if (this.controlContext.options?.onSelectionChanged) {
			this.controlContext.options?.onSelectionChanged();
		}
	}

	/**
	 * Method gets called when single file is selected and prepares the result object.
	 *
	 * @param {File} file File data.
	 * @returns {IFileSelectControlResult | undefined} Result data.
	 */
	private async getSingleFileSelectData(file: File): Promise<IFileSelectControlResult | undefined> {
		if (this.controlContext.options?.fileFilter && !file.type.match(this.controlContext.options?.fileFilter)) {
			//TODO: Body text will be replaced with translatable later on.
			const bodyText = `The file type ${file.type} is not allowed`;
			this.openMsgBoxDialog(bodyText);
			return;
		}

		const maxSize = this.getFileSize();
		const fileSize = file.size;

		if (fileSize > maxSize) {
			//TODO: Body text will be replaced with translatable later on.
			const bodyText = `The file ${file.name} exceeds the allowed file size of ${this.maxSize} and cannot be used`;
			this.openMsgBoxDialog(bodyText);
			return;
		} else {
			this.name.push(file.name);
			this.showName();
			return await this.getFileResultData(file);
		}
	}

	/**
	 * Show name of the file.
	 */
	private showName(): void {
		const fileNameElement = this.elementRef.nativeElement.querySelector('[name=fileName]');
		if (fileNameElement) {
			fileNameElement.textContent = this.name;
		}
	}

	/**
	 * Method gets called when multiple files are selected and prepares the result object.
	 *
	 * @param {FileList} files Files data.
	 * @returns {IFileSelectControlResult[]} Result data.
	 */
	private async getMultiFileSelectData(files: FileList): Promise<IFileSelectControlResult[]> {
		const resultVal = [];

		for (let i = 0; i < files.length; i++) {
			const value = await this.getSingleFileSelectData(files[i]);
			if (value) {
				resultVal.push(value);
			}
		}

		return resultVal;
	}

	/**
	 * Opens popup showing exception/error/general message.
	 *
	 * @param {string} bodyText Dialog content.
	 */
	private openMsgBoxDialog(bodyText: string): void {
		//TODO: Header text is kept static, will be replaced with translatable later on.
		const headerText = 'Invalid Selection';
		this.messageBoxService.showMsgBox(bodyText, headerText, 'ico-info', 'message', false);
	}

	/**
	 * Method converts the maxSize data(KB/MB/Bytes) into bytes.
	 *
	 * @returns {number} Max file size permitted in bytes.
	 */
	private getFileSize(): number {
		const value = this.maxSize.slice(0, -2);
		const unit = this.maxSize.slice(-2);

		if (unit === 'MB') {
			return +value * 1024 * 1024;
		} else if (unit === 'KB') {
			return +value * 1024;
		} else {
			return +value;
		}
	}

	/**
	 * Method prepares and returns result data for file selected.
	 *
	 * @param {File} file Selected file data.
	 * @returns {IFileSelectControlResult} Result data.
	 */
	private async getFileResultData(file: File): Promise<IFileSelectControlResult> {
		const formOptions = this.controlContext.options;
		const resultVal: IFileSelectControlResult = {
			name: file.name,
		};

		if (formOptions && formOptions.retrieveDataUrl) {
			resultVal.data = await this.getDataUrl(file);
		}

		if (formOptions && formOptions.retrieveFile) {
			resultVal.file = file;
		}

		if (formOptions && formOptions.retrieveTextContent) {
			resultVal.content = await this.getText(file);
		}

		return resultVal;
	}

	/**
	 * This method returns the data url holding file content.
	 *
	 * @param {File} file File selected.
	 * @returns {Promise<string>} base64 data url.
	 */
	private getDataUrl(file: File): Promise<string> {
		return new Promise<string>((resolve) => {
			const reader = new FileReader();

			reader.onload = () => {
				resolve(reader.result as string);
			};

			reader.readAsDataURL(file);
		});
	}

	/**
	 * This method returns the string content of the loaded file.
	 * @param file File selected
	 * @returns {Promise<string>} string content of selected file.
	 */
	private getText(file: File): Promise<string> {
		return new Promise(resolve => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.readAsText(file);
		});
	}

	/**
	 * Method called upon delete button click and deletes the selected files.
	 */
	public deleteData(): void {
		this.name = [];
		this.elementRef.nativeElement.querySelector('[name=fileName]').textContent = this.name;
		this.controlContext.value = undefined;
	}

	/**
	 * Method returns the delete button disable state.
	 *
	 * @returns {boolean} Is disabled.
	 */
	public isDeleteButtonDisabled(): boolean {
		return !this.controlContext.value || this.controlContext.readonly;
	}
}