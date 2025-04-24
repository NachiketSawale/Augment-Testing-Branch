/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo} from '@libs/platform/common';

/**
 * uom returns with material search http
 */
export interface IMaterialAttributeUomEntity {
	Uom: string;
	Checked: string;
	DescriptionInfo: IDescriptionInfo;
}