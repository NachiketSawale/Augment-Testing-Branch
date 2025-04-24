/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

/**
 * IEstimateSpecification Interface
 */
export interface IEstimateSpecification {
	/*
	 * Id
	 */
	Id: number;
	/*
	 * Content
	 */
	Content?: string | null;
	/*
	 * Version
	 */
	Version?: number | null;
	/*
	 * IsGCOrder
	 */
	IsGCOrder?: boolean;
	/*
	 * EstStatusFk
	 */
	EstStatusFk?: number;
	/*
	 * Code
	 */
	Code?: string;
	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo;
	/*
	 * MdcLineItemContextFk
	 */
	MdcLineItemContextFk?: number;
	/*
	 * EstConfigtypeFk
	 */
	EstConfigtypeFk?: number;
	/*
	 * EstConfigFk
	 */
	EstConfigFk?: number;
	/*
	 * BasCurrencyFk
	 */
	BasCurrencyFk?: null;
	/*
	 * EstTypeFk
	 */
	EstTypeFk?: number;
	/*
	 * ParentId
	 */
	ParentId?: number | null;
	/*
	 * CompositeItemId
	 */
	CompositeItemId?: number | null;
	/*
	 * IsActive
	 */
	IsActive?: boolean;
	/*
	 * LgmJobFk
	 */
	LgmJobFk?: number;
	/*
	 * IsControlling
	 */
	IsControlling?: boolean;
	/*
	 * RubricCategoryFk
	 */
	RubricCategoryFk?: number;

	/*
	 * ClobsFk
	 */
	ClobsFk?: number | null;
}
