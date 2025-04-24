/*
 * Copyright(c) RIB Software GmbH
 */

import { IReqHeaderEntity } from '@libs/procurement/common';
export interface ICreateReqTypeResult {
	type: string;
	list: IReqHeaderEntity[];
}
