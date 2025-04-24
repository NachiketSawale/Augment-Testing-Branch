/*
 * Copyright(c) RIB Software GmbH
 */
import { IEstStructureConfigEntity } from '@libs/estimate/interfaces';

export interface IEstimateMainStructureDetail extends IEstStructureConfigEntity {
	estStructTypeFk:number;
	estStructConfigDesc:string|null|undefined;
	getQuantityTotalToStructure?:boolean|null;
	isEditStructType:boolean;
	IsUpdStructure:boolean;
	EstAllowanceConfigFk?:number|null;
	EstAllowanceConfigTypeFk?:number|null

}