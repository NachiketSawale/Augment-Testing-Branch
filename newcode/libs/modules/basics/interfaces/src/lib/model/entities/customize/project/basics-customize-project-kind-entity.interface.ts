/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectKindEntity extends IEntityBase, IEntityIdentification {
	ContextFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Remark: string;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
	Icon: number;
}
