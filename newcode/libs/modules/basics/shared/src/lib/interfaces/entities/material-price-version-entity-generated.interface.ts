/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMaterialPriceVersionEntityGenerated extends IEntityBase {
	/**
	 * DataDate
	 */
	DataDate?: string | null;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * MaterialCatalogFk
	 */
	MaterialCatalogFk: number;

	/**
	 * MdcMatPricever2custEntities
	 */
	MdcMatPricever2custEntities?: number[] | null;

	/**
	 * PriceListFk
	 */
	PriceListFk: number;

	/**
	 * ValidFrom
	 */
	ValidFrom?: string | null;

	/**
	 * ValidTo
	 */
	ValidTo?: string | null;

	/**
	 * Weighting
	 */
	Weighting: number;
}
