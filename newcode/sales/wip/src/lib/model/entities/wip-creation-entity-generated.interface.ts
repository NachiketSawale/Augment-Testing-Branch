/*
 * Copyright(c) RIB Software GmbH
 */

export interface IWipCreationEntityGenerated {

	/**
	 * Code
	 */
	Code?: string | null;

	/**
	 * ConfigurationId
	 */
	ConfigurationId?: number | null;

	/**
	 * ContractId
	 */
	ContractId?: number | null;

	/**
	 * ContractIds
	 */
	ContractIds?: number[] | null;

	/**
	 * Description
	 */
	Description?: string | null;

	/**
	 * IncludeMainContract
	 */
	IncludeMainContract?: boolean | null;

	/**
	 * IsCollectiveWip
	 */
	IsCollectiveWip?: boolean | null;

	/**
	 * RubricCategoryId
	 */
	RubricCategoryId?: number | null;

	/**
	 * SideContractIds
	 */
	SideContractIds?: number[] | null;
}
