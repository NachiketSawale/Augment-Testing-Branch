
/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase} from '@libs/platform/common';

export interface IConHeader2BoqWicCatBoqEntity extends IEntityBase {
	Id: number;
	ConHeaderFk: number;
	BoqHeaderFk: number;
	BoqWicCatBoqFk: number;
}
