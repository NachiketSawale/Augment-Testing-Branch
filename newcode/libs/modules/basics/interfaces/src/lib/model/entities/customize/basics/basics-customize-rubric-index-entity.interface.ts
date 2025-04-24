/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeRubricIndexEntity extends IEntityBase, IEntityIdentification {
	RubricFk: number;
	DescriptionInfo?: IDescriptionInfo;
}
