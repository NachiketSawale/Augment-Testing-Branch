/*
 * Copyright(c) RIB Software GmbH
 */

import { IGetDynamicUniqueFieldsRequestGenerated } from '@libs/estimate/interfaces';

export interface IEstimateRuleRemove extends IGetDynamicUniqueFieldsRequestGenerated {
	estimateScope: number;
	structureOrRoot: IStructureOrRoot;
	searchRule: string;
	selectParameter: string;
}

export interface IStructureOrRoot {
	leadingStructure: boolean;
	root: boolean;
	removeParamsWithRules: boolean;
}
