/*
 * Copyright(c) RIB Software GmbH
 */

export interface IEstimateUpdateAssembliesRequestInfo {
	IsPrjAssembly?: boolean;
	ProjectId?: number;
	updateCostCodes?: boolean;
	updateMaterials?: boolean;
	updateAssemblyResources?: boolean;
	updateCostTypes?: boolean;
	updateParameter?: boolean;
	selectUpdateScope?: number;
	selectScope?: string;
	filters?: object;
	assemblyHeaderId?: number;
	assemblyId?: number;
	assemblyIds?: number[];
	updateCostGroup?: number;
}