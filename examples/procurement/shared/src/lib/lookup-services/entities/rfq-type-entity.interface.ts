/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo} from '@libs/platform/common';

export class IRfqTypeEntity {
	public constructor(public Id: number) {

	}

	/**
	 * description info
	 */
	public DescriptionInfo?: IDescriptionInfo;

}