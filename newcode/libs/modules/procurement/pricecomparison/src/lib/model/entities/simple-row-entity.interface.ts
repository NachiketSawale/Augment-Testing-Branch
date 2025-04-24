/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface ISimpleRowEntity<T = number> {
	Id: T;
	Description?: string;
	DescriptionInfo?: IDescriptionInfo;
	UserLabelName?: string;
}