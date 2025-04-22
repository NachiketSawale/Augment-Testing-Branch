/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase, IEntityIdentification} from '@libs/platform/common';

export interface IReqVariantEntity extends IEntityBase, IEntityIdentification {
	ReqHeaderFk: number;
	Code?: string | null;
	Description?: string | null;
	Comment?: string | null;
	Remarks?: string | null;
}
