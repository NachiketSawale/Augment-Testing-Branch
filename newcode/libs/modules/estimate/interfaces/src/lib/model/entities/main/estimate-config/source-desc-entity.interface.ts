/*
 * Copyright(c) RIB Software GmbH
 */

export interface ISourceDescEntity {
	Id: number;
	StructureName: string;
	RootItemId: number;
	Desc:string;
	EstStructureId: number | null;
	IsCostGroupCat: boolean;
}