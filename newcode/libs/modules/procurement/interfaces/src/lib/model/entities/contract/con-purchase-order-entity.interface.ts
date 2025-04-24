/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

/**
 * Interface of contract header purchase order entity
 */
export interface IConPurchaseOrderEntity extends IEntityBase {
	/**
	 * ConHeaderFk
	 */
	ConHeaderFk?: number | null;

	/**
	 * PurchaseOrders
	 */
	PurchaseOrders?: number | null;

	/**
	 * MaterialCatalogFk
	 */
	MaterialCatalogFk?: number | null;

	/**
	 * BoqWicCatFk
	 */
	BoqWicCatFk?: number | null;

	/**
	 * IsFramework
	 */
	IsFramework: boolean;
}