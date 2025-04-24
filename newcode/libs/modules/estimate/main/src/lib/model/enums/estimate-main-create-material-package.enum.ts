/*
 * Copyright(c) RIB Software GmbH
 */

export enum EstimateMainCreateMaterialPackageSelectionOption {
	/**
	 * Procurement Structure
	 */
	ProcurementStructure = 0,
	/**
	 * Cost Code
	 */
	CostCode = 1,
	/**
	 * MaterialCatalog & Group
	 */
	MaterialCatalogAndGroup = 2,
	/**
	 * Material&CostCode
	 */
	MaterialAndCostCode = 3,
}

export enum EstimateMainCreateMaterialPackageModeOption {
	/**
	 * Inclusive Mode
	 */
	inclusiveMode = 2,
	/**
	 * Distinct Mode
	 */
	distinctMode = 1
}

export enum EstimateMainCreateMaterialPackageItemType {
	/**
	 * Material
	 */
	Material = 0,
	/**
	 * Cost Code
	 */
	MdcCostCode = 1,
	/**
	 * project Cost Code
	 */
		// eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
	PrjCostCode=1,

}


export enum EstimateMainCreateMaterialPackageCatalogGroupType {
	/**
	 * Catalog
	 */
	MdcCatalog = 1,
	/**
	 * Group
	 */
	MdcGroup = 0,
}

export enum EstimateMainCreateMaterialPackageCostCodeType {
	/**
	 * Cost Code
	 */
	MdcCostCode = 0,
	/**
	 * project Cost Code
	 */
	PrjCostCode = 1,
}

export enum EstimateMainCreateMaterialPackageMatchnessType {
	/**
	 * New
	 */
	New = 1,
	/**
	 * Perfectly Match
	 */
	PerfectlyMatched = 2,
	/**
	 * criteria Match
	 */
	CriteriaMatched = 3,
	/**
	 * User Specified
	 */
	UserSpecified = 4
}