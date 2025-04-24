/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICreatePrrHeaderParamGenerated {

	/**
	 * companyPeriodFk
	 */
	companyPeriodFk: number;

	/**
	 * companyYearFk
	 */
	companyYearFk: number;

	/**
	 * createByAddtion
	 */
	createByAddtion: boolean;

	/**
	 * createFromWiard
	 */
	createFromWiard: boolean;


	/**
	 * projectId
	 */
	projectId?: number | null;

	/**
	 * projectIds
	 */
	projectIds?: number[] | null;
}
