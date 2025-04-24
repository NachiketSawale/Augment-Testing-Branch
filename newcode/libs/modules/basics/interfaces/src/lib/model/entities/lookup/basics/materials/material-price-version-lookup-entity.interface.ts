/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMaterialPriceVersionLookupEntity extends IEntityBase {

	/**
	 * Id
	 */
	Id: number;

	/**
	 * MaterialCatalogFk
	 */
	MaterialCatalogFk: number;

	/**
	 * PriceListFk
	 */
	PriceListFk: number;

	/**
	 * PriceListContextFk
	 */
	PriceListContextFk?: number;

	/**
	 * PriceListCurrencyFk
	 */
	PriceListCurrencyFk?: number;

	/**
	 * ValidFrom
	 */
	ValidFrom?: Date | null;

	/**
	 * ValidTo
	 */
	ValidTo?: Date | null;

	/**
	 * MaterialPriceVersionDescriptionInfo
	 */
	MaterialPriceVersionDescriptionInfo?: IDescriptionInfo | null;

	/**
	 * PriceListDescriptionInfo
	 */
	PriceListDescriptionInfo?: IDescriptionInfo | null;
}