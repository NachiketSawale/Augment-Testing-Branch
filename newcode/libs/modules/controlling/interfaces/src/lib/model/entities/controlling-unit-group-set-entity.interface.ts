/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IControllingUnitdGroupSetEntity extends IEntityBase, IEntityIdentification {
	ControllinggroupFk: number;
	ControllinggrpsetFk?: number;
	headerFk?: number;

	//todo Previous design problem: there are different modules, the name is not the same, need to be renamed in the background
	ControllinggroupdetailFk?: number | undefined;
	ControllinggrpdetailFk?: number | undefined;
}