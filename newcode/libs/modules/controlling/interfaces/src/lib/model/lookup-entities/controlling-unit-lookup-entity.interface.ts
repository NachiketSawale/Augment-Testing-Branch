/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

/**
 * Controlling unit lookup entity interface
 */
export interface IControllingUnitLookupEntity extends IEntityIdentification {
	Code: string;
	Quantity: number;
	DescriptionInfo: IDescriptionInfo;
	Isaccountingelement: boolean;
	Isassetmanagement: boolean;
	PrjProjectFk: number;
	CompanyFk: number;
	UomFk?: number;
	EstimateCost: number;
	Budget: number;
	ControllingunitFk?: number;
	ChildItems?: Array<IControllingUnitLookupEntity>;
}
