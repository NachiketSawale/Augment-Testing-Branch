/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * IFilterInfo interface represents filter information
 */
export interface IFilterInfo {
	totalRec: number;
	startRec: number;
	endRec: number;
	isPending: boolean;
	executionInfo: string | '';
	recordInfoText: string;
	forwardEnabled: boolean;
	backwardEnabled: boolean;
}
