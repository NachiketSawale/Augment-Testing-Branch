/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * replace neutral material wizard from which procurement module.
 */
export enum ProcurementModuleReplaceNeutralMaterialWizard {
	/**
	 * Package
	 */
	Package = 0,
	/**
	 * Requisition
	 */
	Requisition = 1,
	/**
	 * Contract
	 */
	Contract,
	/**
	 * Quote
	 */
	Quote,

}


/**
 * replace neutral material option enum
 */
export enum ProcurementReplaceNeutralMaterialOption {
	/**
	 * Highlighted Material
	 */
	HighlightedMaterial = 0,
	/**
	 *current selected lead record set value=1
	 */
	CurrentLeadRecord = 1,
	/**
	 *all lead record set value=2
	 */
	AllLeadRecordsByCurrentProject = 2,
}

/**
 * replace neutral material Response Status
 */
export enum ProcurementReplaceNeutralMaterialCatalogFilter {
	/**
	 * All Catalog set value=1
	 */
	AllCatalog = 1,
	/**
	 * Specific Catalog set value=0
	 */
	SpecificCatalog = 0,
}

/**
 * replace neutral material Criteria enum
 */
export enum ProcurementReplaceNeutralMaterialCriteria {
	/**
	 * By neutral material assignment set value=1
	 */
	NeutralMaterialAssignment = 1,
	/**
	 * By identical material code set value=2
	 */
	IdenticalMaterialCode = 2,
	/**
	 * By Procurement Structure set value=3
	 */
	ProcurementStructure = 3,
}

/**
 * replace neutral material Replace Status
 */
export enum ProcurementReplaceNeutralMaterialReplaceStatus {
	/**
	 * Passed set value=1
	 */
	Passed = 1,
	/**
	 * Passed Converted set value=2
	 */
	PassedConverted = 2,
	/**
	 *Failed set value=3
	 */
	Failed = 3,
	/**
	 * No Found set value=4
	 */
	NoFound = 4,
}

/**
 * replace neutral material Response Status
 */
export enum ProcurementReplaceNeutralMaterialResponseStatus {
	/**
	 *no lead found set value=1
	 */
	NoLead = 1,
	/**
	 * no item found set value=2
	 */
	NoItem = 2,
}
