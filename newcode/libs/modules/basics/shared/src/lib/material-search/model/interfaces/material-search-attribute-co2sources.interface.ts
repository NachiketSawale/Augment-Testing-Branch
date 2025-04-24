/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo} from '@libs/platform/common';

/**
 * co2sources returns with material search http
 */
export interface IMaterialAttributeCo2SourcesEntity {
	Id: number;
	Checked: string;
	DescriptionInfo: IDescriptionInfo;
}