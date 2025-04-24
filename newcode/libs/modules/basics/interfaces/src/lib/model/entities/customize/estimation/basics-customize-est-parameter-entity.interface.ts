/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEstParameterEntity extends IEntityBase, IEntityIdentification {
	ParametergroupFk: number;
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	ValueDetail: string;
	DefaultValue: number;
	UomFk: number;
	Islookup: boolean;
	RuleParamValueFk: number;
	IsLive: boolean;
	ValueText: string;
	ParameterText: string;
	ParamvaluetypeFk: number;
	SourceId?: number | null;
	ParameterValue?: number | null;
}
