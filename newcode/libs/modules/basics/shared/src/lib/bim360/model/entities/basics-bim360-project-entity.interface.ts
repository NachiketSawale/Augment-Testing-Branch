/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IBasicsBim360ProjectEntity {
	/**
	 * The specific ID.
	 * Note: added for grid. Grid needs this field.
	 */
	Id: number;

	/**
	 * Project ID in RIB 4.0
	 */
	PrjId: number;

	/**
	 * Project Number in RIB 4.0
	 */
	ProjectNo: string | null;

	/**
	 * Company ID in RIB 4.0
	 */
	CompanyId: number;

	/**
	 * Project Key from BIM 360
	 */
	PrjKey: string | null;

	/**
	 * Project Name in RIB 4.0 and BIM 360.
	 */
	ProjectName: string | null;

	/**
	 * Currency.
	 */
	Currency: string | null;
}
