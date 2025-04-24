/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IBasicsSearchStructureEntity {
	Id: number;
	Code?: string | null;
	CodeDescription: string;
	ParentId?: number | null;
	ChildItems?: IBasicsSearchStructureEntity[];
	Image: string;
	IsPrcStructure: boolean;
	PreDefine: IBasicsSearchStructurePreDefine;
}

export interface IBasicsSearchStructurePreDefine {
	StructureId?: number | undefined;
	GroupId?: number | undefined;
	CategoryId?: number | undefined;
}