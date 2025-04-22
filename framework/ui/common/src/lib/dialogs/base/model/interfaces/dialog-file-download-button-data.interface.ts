/*
 * Copyright(c) RIB Software GmbH
 */
import { IDialog } from './dialog.interface';
import { IDialogButtonEventInfo } from './dialog-button-event-info.interface';

/**
 * Represents the data structure for a file download button in a dialog.
 * This interface defines the properties and methods required to handle
 * file download functionality within a dialog component.
 *
 * @typeParam TData - The type of the data to be downloaded.
 * @typeParam TSrcDialog - The type of the source dialog implementing the `IDialog` interface.
 * @typeParam TDetails - The type of additional details associated with the dialog (default is `void`).
 *
 */
export interface IDialogFileDownloadButtonData<TData, TSrcDialog extends IDialog<TDetails>, TDetails = void> {
	/**
	 * The name of the file to be downloaded (optional).
	 */
	name?: string;

	/**
	 * The type of the file to be downloaded (optional).
	 */
	type?: string;

	/**
	 * A method that takes dialog button event information and returns the data to be downloaded.
	 */
	dataContent(info: IDialogButtonEventInfo<TSrcDialog, TDetails>): TData;
}
