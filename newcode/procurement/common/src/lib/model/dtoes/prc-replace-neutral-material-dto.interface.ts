/*
 * Copyright(c) RIB Software GmbH
 */

export interface IProcurementCommonReplaceCriteriaDto {
	Id:number;
	Selected: boolean;
	Name: string;
}

export interface IProcurementCommonReplaceNeutralMaterialSimulationDto {
	Id: number;
	Selected: boolean;
	Status: number;
	MaterialCode: string;
	MaterialUoM: number;
	CurrentPrice: number;
	MathingMaterialCode: number;
	MathingSupplier: number;
	MatchingPrice: number;
	Variance: number,
	VariancePercent: number;
	ReplaceMaterials:IProcurementCommonReplaceNeutralMaterialResultDto[]
}

export interface IProcurementCommonReplaceNeutralMaterialResultDto {
	Id: number;
	Selected: boolean;
	Status: number;
	Type: number;
	MaterialCode: number;
	MaterialPrice: string;
	ConvertPrice: number;
	SubstitutePrice: number;
	SubstituteMaterialId: number;
	Variance: number;
	VariancePercent: number;
	BpdBusinesspartnerFk: number;
}