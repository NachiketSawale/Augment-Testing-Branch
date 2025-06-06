/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeThreeDVisualizationTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Remark: string;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
