/*
 * Copyright(c) RIB Software GmbH
 */

export interface IEstimateUpdateAssemblies {
	updateCostCodes?: boolean;
	updateMaterials?: boolean;
	updateAssemblyResources?: boolean;
	updateCostTypes?: boolean;
	updateParameter?: boolean;
	selectUpdateScope?: number;
	selectScope?: string;
}
