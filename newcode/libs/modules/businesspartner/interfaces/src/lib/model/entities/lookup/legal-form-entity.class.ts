/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo} from '@libs/platform/common';

/**
 * Currency entity
 */
export class LegalFormEntity {
	/**
	 * description info
	 */
	public DescriptionInfo!: IDescriptionInfo;

	public Sorting!: number;
	public IsDefault!: boolean;
	public IsLive!: boolean;
	public BasCountryFk?: number | null;

	/**
	 * constructor
	 * @param Id
	 */
	public constructor(public Id: number) {

	}
}