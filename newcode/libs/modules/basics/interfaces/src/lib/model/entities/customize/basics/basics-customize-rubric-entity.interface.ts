/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeRubricEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
}
