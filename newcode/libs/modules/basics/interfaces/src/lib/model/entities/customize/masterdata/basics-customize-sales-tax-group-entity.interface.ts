/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeSalesTaxGroupEntity extends IEntityBase, IEntityIdentification {
	LedgerContextFk: number;
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	Reference: string;
	CommentText: string;
	UserDefined01: string;
	UserDefined02: string;
	UserDefined03: string;
	IsLive: boolean;
}
