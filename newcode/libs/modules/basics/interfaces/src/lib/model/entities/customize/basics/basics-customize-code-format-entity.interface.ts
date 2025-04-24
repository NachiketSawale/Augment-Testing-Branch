/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeCodeFormatEntity extends IEntityBase, IEntityIdentification {
	CodeformattypeFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Startvalue: string;
	Prefix: string;
	Suffix: string;
	Increment: number;
	Minlength: number;
	Remark: string;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
