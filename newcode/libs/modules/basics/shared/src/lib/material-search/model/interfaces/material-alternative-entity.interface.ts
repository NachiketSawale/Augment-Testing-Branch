/*
 * Copyright(c) RIB Software GmbH
 */

import {InjectionToken} from '@angular/core';
import {IDescriptionInfo} from '@libs/platform/common';

/**
 * Entity to store material alternative
 */
export interface IMaterialAlternativeEntity {
	Id: number;
	Code: string;
	DescriptionInfo: IDescriptionInfo;
	PriceUnitUomInfo: IDescriptionInfo,
	CatalogCode: string;
	CatalogDescriptionInfo: IDescriptionInfo;
	Cost: number;
	Currency: string;
}

/**
 * injection token of alternative
 */
export const MATERIAL_SEARCH_ALTERNATIVES = new InjectionToken<IMaterialAlternativeEntity[]>('MATERIAL_SEARCH_ALTERNATIVES');