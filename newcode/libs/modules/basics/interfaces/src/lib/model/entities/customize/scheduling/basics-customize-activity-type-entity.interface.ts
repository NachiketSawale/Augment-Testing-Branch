/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeActivityTypeEntity extends IEntityBase, IEntityIdentification {
	Remark: string;
	DescriptionInfo?: IDescriptionInfo;
}
