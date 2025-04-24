/*
 * Copyright(c) RIB Software GmbH
 */
export interface IPageableLongTextDialogData {
	/**
	 * Current text to be shown.
	 */
	text: string;

	/**
	 * Total page count.
	 */
	totalPageCount?: number;
}
