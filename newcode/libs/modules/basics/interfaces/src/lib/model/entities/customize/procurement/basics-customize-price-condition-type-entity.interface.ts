/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePriceConditionTypeEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	Value: number;
	Sorting: number;
	IsDefault: boolean;
	HasValue: boolean;
	HasTotal: boolean;
	IsPriceComponent: boolean;
	IsPrinted: boolean;
	IsBold: boolean;
	Formula: string;
	IsShowInTicketSystem: boolean;
	IsLive: boolean;
	FormulaDate: string;
	UserDefined1: string;
	UserDefined2: string;
	UserDefined3: string;
	UserDefined4: string;
	UserDefined5: string;
}
