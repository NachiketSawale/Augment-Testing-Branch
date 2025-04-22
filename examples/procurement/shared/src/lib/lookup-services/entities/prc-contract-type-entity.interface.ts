/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export class IPrcContractTypeEntity {
	public constructor(public Id: number) {

	}

	/**
	 * description info
	 */
	public DescriptionInfo?: IDescriptionInfo;

}