/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

/**
 * country entity
 */
export class CountryEntity {

	public AreaCode?: string;

	public Iso2?: string;

	public Recordstate: boolean = false;

	public DescriptionInfo!: IDescriptionInfo;

	public constructor(public Id: number, public Description: string) {

	}
}