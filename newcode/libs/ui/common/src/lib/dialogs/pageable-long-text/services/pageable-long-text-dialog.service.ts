/*
 * Copyright(c) RIB Software GmbH
 */
import { set } from 'lodash';
import { inject, Injectable } from '@angular/core';

import { PageableLongTextDialogComponent } from '../components/pageable-long-text-dialog/pageable-long-text-dialog.component';

import { ICustomDialog, IDialogButtonBase, IDialogButtonEventInfo, IDialogResult, UiCommonDialogService } from '../../base';
import { IPageableLongTextDialogOptions, PAGEABLE_DIALOG_BOX_OPTIONS } from '../model/interfaces/pageable-long-text-dialog-options.interface';

/**
 * This service displays pageable long text modal dialog.
 *
 * @group Dialogs
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonPageableLongTextDialogService {
	/**
	 * Opens/Closes dialog.
	 */
	private readonly modalDialogService = inject(UiCommonDialogService);

	/**
	 * Displays pagebale long text dialog.
	 *
	 * @param options Dialog options.
	 * @returns Dialog result.
	 */
	public show(options: IPageableLongTextDialogOptions): Promise<IDialogResult> | undefined {
		const pageableOptions = this.modalDialogService.createOptionsForCustom(options, 
			dlg => dlg.body.dialogInfo, 
			PageableLongTextDialogComponent, 
			[{
				provide: PAGEABLE_DIALOG_BOX_OPTIONS,
				useValue: options,
			}],
		);

		pageableOptions.windowClass = 'longtext-dialog';
		pageableOptions.customButtons = this.getCustomButtons(options).concat(pageableOptions.customButtons ?? []);
		pageableOptions.width = pageableOptions.width ? pageableOptions.width : '50%';
		pageableOptions.height = pageableOptions.height ? pageableOptions.height : '50%';

		return this.modalDialogService.show(pageableOptions);
	}

	/**
	 * Method returns the custom buttons for the dialog.
	 *
	 * @param options Dialog options.
	 * @returns Custom buttons.
	 */
	private getCustomButtons(options: IPageableLongTextDialogOptions): Array<IDialogButtonBase<ICustomDialog<void, PageableLongTextDialogComponent, void>, void>> {
		const buttons = [];

		//Pagination buttons
		buttons.push(...this.getPaginationButtons(options));

		//Copy to clipboard button.
		buttons.push(this.getCopyToClipBoardButton(options));

		return buttons;
	}

	/**
	 * Method returns the pagination buttons for the dialog.
	 *
	 * @param options Dialog options.
	 * @returns Pagination buttons.
	 */
	private getPaginationButtons(options: IPageableLongTextDialogOptions): Array<IDialogButtonBase<ICustomDialog<void, PageableLongTextDialogComponent, void>, void>> {
		return [
			{
				id: 'back',
				caption: {
					key: 'platform.previousPage',
					text: 'Back',
				},
				isDisabled: () => {
					return options.dataSource.isPaginating || !options.dataSource.hasPreviousPage();
				},
				fn: () => {
					options.dataSource.isPaginating = true;
					options.dataSource.loadPreviousPage().then(() => {
						options.dataSource.isPaginating = false;
					});
				},
			},
			{
				id: 'next',
				caption: {
					key: 'platform.nextPage',
					text: 'Next',
				},
				isDisabled: () => {
					return options.dataSource.isPaginating || !options.dataSource.hasNextPage();
				},
				fn: () => {
					options.dataSource.isPaginating = true;
					options.dataSource.loadNextPage().then(() => {
						options.dataSource.isPaginating = false;
					});
				},
			},
		];
	}

	/**
	 * Method returns the copy button for the dialog.
	 *
	 * @param options Dialog options.
	 * @returns Copy to clipboard button.
	 */
	private getCopyToClipBoardButton(options: IPageableLongTextDialogOptions): IDialogButtonBase<ICustomDialog<void, PageableLongTextDialogComponent, void>, void> {
		//TODO: Below implementation is just the demo will be modified when copy button available.
		return this.modalDialogService['createCopyToClipboardButton'](
			() => {
				return options.dataSource.currentText;
			},
			{
				processSuccess: (info: IDialogButtonEventInfo<ICustomDialog<void, PageableLongTextDialogComponent, void>, void>, msgKey: string) => {
					set(info.dialog, 'alarm', msgKey);
				},
			},
		);
	}
}
