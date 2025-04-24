/*
 * Copyright(c) RIB Software GmbH
 */
import { IUniqueFieldDto } from '@libs/basics/shared';

export interface ICreateMatPkgBasicOptionItem {
	scopeOption: number,
	selectedItem: number,
	isSelectedReferenceLineItem: boolean,
	isSelectMultiPackageAssignmentModel: boolean,
	isAllResultTobeChosen: boolean
}

export interface ICreateMatPkgBasicOption {
	optionItem: ICreateMatPkgBasicOptionItem
}

export interface ICreateMatPkgSelectionOptionItem {
	selectedItem: number,
	isRootLevel: boolean,
	isRootLevelDisable: boolean,
	modeOption: number,
	isIncludeMaterial: boolean,
	isIncludeDirectCost: boolean,
	isIncludeInDirectCost: boolean,
	isIncludeMarkUpCost: boolean,
	showCostCodeItems: ICreateMatPkgCostCodeSelectionItem[],
	showMaterialAndCostCodeItems: ICreateMatPkgMatAndCCSelectionItem[],
	selectionMaterialAndCostCodeItems: ICreateMatPkgMatAndCCSelectionItem[],
}

export interface ICreateMatPkgSelectionOption {
	optionItem: ICreateMatPkgSelectionOptionItem,
	selectionItems: ICreateMatPkgSelectionItem[],

}

export interface ICreateMatPkgSelectionBasItem {
	Idx: string,
	Id: number,
	Selected: boolean,
	Code: string,
	Description: string,
}

export interface ICreateMatPkgSelectionItem extends ICreateMatPkgSelectionBasItem {
	ParentFk: number,
	resultChildren: ICreateMatPkgSelectionItem[],
	TypeFk: number
}

export interface ICreateMatPkgStructureSelectionItem extends ICreateMatPkgSelectionItem {
}

export interface ICreateMatPkgCostCodeSelectionItem extends ICreateMatPkgSelectionItem {
	CostCodeTypeFk: number,
	IsCost: boolean,
}

export interface ICreateMatPkgCatAndGrpSelectionItem extends ICreateMatPkgSelectionItem {
	MaterialCatalogFk: number,
}

export interface ICreateMatPkgMatAndCCSelectionItem extends ICreateMatPkgSelectionItem {
	Description2: string,
	Type: number,
	MaterialGroupCode: string,
	MaterialGroupDescription: string,
	StructureCode: string,
	StructureDescription: string,
	BusinessPartnerFk: number,
	InDirectCost: boolean,
	IsCost: boolean,
}

export interface ICreateMatPkgSimulationItem {
	Selected: boolean,
	Merge: boolean,
	Matchness: string,
	MatchnessType: number,
	Code: string,
	Description: string,
	PackageStatusFk: number,
	PackageCodeFk: number,
	PackageDescriptionFk: number,
	PackageDescription: string,
	ConfigurationFk: number,
	ClerkPrcFk: number,
}

export interface ICreateMatPkgSimulationOptionItem {
	isGenerateItem: boolean,
	isAggregateProfile: boolean,
	isGenerateCostCode: boolean,
	isFreeQuantity: boolean,
	isOnePackage: boolean,
	isSeparateMaterialCatalog: boolean,
	simulationItems: ICreateMatPkgSimulationItem[],
	uniqueFields: IUniqueFieldDto[]
}

export interface ICreateMatPkgNewPackageOption {
	procurementstructureId: number | null,
	configurationId: number | null,
	code: string,
	packageDescription: string,
	subpackageDescription: string,
	reference: string,
	responsibleId: number | null,
}

export interface ICreateMatPkgSimulationOption {
	optionItem: ICreateMatPkgSimulationOptionItem,
	newPackageOption: ICreateMatPkgNewPackageOption
}

export interface ICreateMatPkgDataComplete {
	basicOptions: ICreateMatPkgBasicOption
	selectionOptions: ICreateMatPkgSelectionOption,
	simulationOptions: ICreateMatPkgSimulationOption,
}

export interface ICreateMatPkgPackageAssignmentItem {
	StatusFk: number;
	CodeFk: number;
	PackageDescriptionFk: number;
	StructureCodeFk: number;
	BusinessPartnerFk: number;
}