/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeSCurveDetailEntity extends IEntityBase, IEntityIdentification {
	ScurveFk: number;
	Percentoftime: number;
	Percentofcost: number;
	Comment: string;
	Bin: number;
	Weight: number;
}
