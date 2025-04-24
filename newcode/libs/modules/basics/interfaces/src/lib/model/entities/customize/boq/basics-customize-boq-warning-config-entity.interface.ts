/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBoqWarningConfigEntity extends IEntityBase, IEntityIdentification {
	Code: number;
	WarningActionFk: number;
	DescriptionInfo?: IDescriptionInfo;
}
