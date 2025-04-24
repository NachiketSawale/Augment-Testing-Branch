/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo} from '@libs/platform/common';

/**
 * Co2Source entity
 */
export class Co2SourceEntity {
	/**
	 * description info
	 */
	public DescriptionInfo!: IDescriptionInfo;
	/**
	 * IsLive
	 */
	public IsLive!: boolean;
	/**
	 * IsDefault
	 */
	public IsDefault!: boolean;
	/**
	 * Sorting
	 */
	public Sorting!: number;

	/**
	 * constructor
	 * @param Id
	 */
	public constructor(public Id: number) {
	}
}