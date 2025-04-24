/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Provide constants for Replace function type
 */
export enum EstimateMainReplaceFunctionType {
	CostCode = 11,
	ReplaceCostCode = 111,
	ReplaceCostCodeByMaterial = 112,
	ReplaceCostCodeByAssembly = 113,
	Material = 12,
	ReplaceMaterial = 121,
	ReplaceMaterialByCostCode = 122,
	ReplaceMaterialByAssembly = 123,
	Assembly = 13,
	ReplaceAssembly = 131,
	ReplaceEquipmentAssemblyByEquipmentAssembly = 132,
	Remove = 14,
	RemoveResource = 141,
	EquipmentAssembly = 15
}
