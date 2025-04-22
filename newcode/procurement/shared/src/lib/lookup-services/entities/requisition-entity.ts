/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IRequisitionEntity extends IEntityBase {
	Id: number;
	Code: string;
	Description?: string;
	ReqHeaderFk?: number;
	ReqStatusFk: number;
}