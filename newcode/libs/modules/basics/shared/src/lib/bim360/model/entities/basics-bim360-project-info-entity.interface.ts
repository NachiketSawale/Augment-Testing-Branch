/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IBasicsBim360ProjectInfoEntity {
	/**
	 * Project ID in RIB 4.0
	 */
	prjId: number;

	/**
	 * Project Number in RIB 4.0
	 */
	projectNo: string | null;

	/**
	 * Company ID in RIB 4.0
	 */
	companyId: number;

	/**
	 * Project Key from BIM 360
	 */
	prjKey: string | null;

	/**
	 * Project Name in RIB 4.0 and BIM 360.
	 */
	projectName: string | null;

	/**
	 * Currency.
	 */
	currency: string | null;
}
