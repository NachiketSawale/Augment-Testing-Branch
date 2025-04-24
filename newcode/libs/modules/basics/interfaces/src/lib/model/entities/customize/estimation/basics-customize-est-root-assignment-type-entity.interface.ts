/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEstRootAssignmentTypeEntity extends IEntityBase, IEntityIdentification {
	LineitemcontextFk: number;
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	IsLive: boolean;
}
