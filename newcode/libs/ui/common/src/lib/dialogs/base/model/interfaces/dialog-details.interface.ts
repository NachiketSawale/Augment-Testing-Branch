/*
 * Copyright(c) RIB Software GmbH
 */

import { DialogDetailsType } from '../enums/dialog-details-type.enum';

/**
 * The interface for the details area in a dialog box.
 *
 * This interface represents the details area in a dialog box that is being displayed.
 * For options to configure a details area, see {@link ConcreteDialogDetailOptions}.
 *
 * @group Dialog Framework
 */
export interface IDialogDetails<TDetailsBody = void> {

	/**
	 * Gets or sets a value that determines whether the details are expanded (visible) or
	 * collapsed (invisible).
	 */
	isVisible: boolean;

	/**
	 * The type of the details area displayed.
	 */
	readonly type: DialogDetailsType;

	/**
	 * Gets a reference to the details component while it is being displayed.
	 */
	readonly customDetails?: TDetailsBody;
}