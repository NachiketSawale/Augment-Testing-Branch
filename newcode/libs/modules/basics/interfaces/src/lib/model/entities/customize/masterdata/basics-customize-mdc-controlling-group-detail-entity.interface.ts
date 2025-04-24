/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMdcControllingGroupDetailEntity extends IEntityBase, IEntityIdentification {
	ControllinggroupFk: number;
	Code: number;
	DescriptionInfo?: IDescriptionInfo;
	CommentText: string;
}
