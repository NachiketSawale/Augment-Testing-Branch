/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IFilterInfo } from '../interfaces/filter-info.interface';

/**
 * Represents a filter information object with methods to access its properties.
 */
export class FilterInfo implements IFilterInfo {
	public totalRec: number = 0;
	public startRec: number = 0;
	public endRec: number = 0;
	public isPending: boolean = false;
	public executionInfo: string = '';
	public recordInfoText: string = '';
	public forwardEnabled: boolean = false;
	public backwardEnabled: boolean = false;

	/**
	 * To reset filterInfo
	 * @method reset
	 */
	public reset(): void {
		this.totalRec = 0;
		this.startRec = 0;
		this.endRec = 0;
		this.executionInfo = '';
		this.recordInfoText = '';
		this.forwardEnabled = false;
		this.backwardEnabled = false;
		this.isPending = false;
	}
}
