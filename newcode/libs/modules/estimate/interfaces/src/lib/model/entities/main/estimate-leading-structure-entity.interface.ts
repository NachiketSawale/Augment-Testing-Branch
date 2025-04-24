/*
 * Copyright(c) RIB Software GmbH
 */

export interface IEstimateSharedLeadingStructureEntity {
	Id: number;
	EstStructureId?: number;
	Desc: string;
	IsCostGroupCat: boolean;
	RootItemId: number;
	StructureName: string;
}