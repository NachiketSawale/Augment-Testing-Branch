/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification} from '@libs/platform/common';

export interface IBasicsUomEntity extends IEntityBase , IEntityIdentification {
	UnitInfo?:IDescriptionInfo;
	DescriptionInfo?: IDescriptionInfo;
	RoundingPrecision?: number;
	UomTypeFk?: number;
	IsLive?: boolean;
	LengthDimension?:number;
	MassDimension?:number;
	TimeDimension?:number;
	IsBase?: boolean;
	Factor?:number;
	Sorting?:number;
	Fallback?: boolean;
}