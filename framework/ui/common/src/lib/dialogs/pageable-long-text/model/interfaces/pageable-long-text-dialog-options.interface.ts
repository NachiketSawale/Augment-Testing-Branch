/*
 * Copyright(c) RIB Software GmbH
 */
import { InjectionToken } from '@angular/core';
import { IDialog, IDialogOptions } from '../../../base';
import { PageableLongTextDialogDataSource } from '../classes/pageable-long-text-dialog-data-source.class';
import { TextDisplayType } from '../../../../model/text-display/enums/text-display-type.enum';


/**
 * Body specific data.
 */
export interface IPageableLongTextDialogBodyData {
	/**
	 * Body data.
	 */
	readonly dataSource: PageableLongTextDialogDataSource;

	/**
	 * Data display type.
	 */
	readonly type: TextDisplayType;
}

/**
 * Stores options for dialog.
 */
export type IPageableLongTextDialogOptions = IDialogOptions<IDialog> & IPageableLongTextDialogBodyData;

/**
 * Token for dialog body data.
 */
export const PAGEABLE_DIALOG_BOX_OPTIONS = new InjectionToken<IPageableLongTextDialogBodyData>('pageable-box-options');

