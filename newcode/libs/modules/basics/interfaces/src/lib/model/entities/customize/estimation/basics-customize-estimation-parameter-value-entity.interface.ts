/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEstimationParameterValueEntity extends IEntityBase, IEntityIdentification {
	ParameterFk: number;
	DescriptionInfo?: IDescriptionInfo;
	ValueDetail: string;
	Value: number;
	ValueText: string;
	IsDefault: boolean;
	ValueType: number;
}
