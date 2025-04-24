/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo} from '@libs/platform/common';

/**
 * material price condition interface
 */
export interface IMaterialSearchPriceCondition {
	Id: number;
	Description: string;
	PriceConditionType: IMaterialSearchPriceConditionType;
	IsActivated: boolean;
	TotalOc: number;
}

/**
 * material price condition type interface
 */
export interface IMaterialSearchPriceConditionType {
	Id: number;
	DescriptionInfo: IDescriptionInfo;
	IsShowInTicketSystem:boolean
}