/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeQuantityTypeEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	CommentText: string;
	Iseditable: boolean;
	Isusercontrolled: boolean;
	Ismaintable: boolean;
}
