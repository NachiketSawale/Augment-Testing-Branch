/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeCustomerEvaluationMotiveEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	Isgroupa: boolean;
	Isgroupb: boolean;
	Isgroupc: boolean;
	IsLive: boolean;
}
