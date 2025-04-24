/*
 * Copyright(c) RIB Software GmbH
 */

import { IProcurementCommonReplaceCriteriaDto, IProcurementCommonReplaceNeutralMaterialResultDto,IProcurementCommonReplaceNeutralMaterialSimulationDto } from '../../../model/dtoes';

export interface IProcurementCommonReplaceNeutralBasicOption {
	scopeSetting: number,
	fromCatalog: number,
	specificCatalogFk?:number
}

export interface IProcurementCommonReplaceNeutralOptionItem {
	optionItem : IProcurementCommonReplaceNeutralBasicOption;
	replaceCriteria:IProcurementCommonReplaceCriteriaDto[]
}
export interface IProcurementCommonReplaceNeutralReplaceItem {
	simulationItems :IProcurementCommonReplaceNeutralMaterialSimulationDto[]
	resultItems:IProcurementCommonReplaceNeutralMaterialResultDto[]
}

export interface IProcurementCommonReplaceNeutralMaterialComplete {
	basicOption: IProcurementCommonReplaceNeutralOptionItem,
	currentModuleText: string,
	leadOptionText: string,
	hasMaterial: boolean,
	hasProject: boolean,
	replaceItem:IProcurementCommonReplaceNeutralReplaceItem
}