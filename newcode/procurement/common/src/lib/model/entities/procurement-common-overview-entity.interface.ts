/*
 * Copyright(c) RIB Software GmbH
 */
export interface IProcurementCommonOverviewEntity {
	Id: string;
	Uuid: string;
	ParentUuid: string;
	Count: number;
	Description: string;
	Title: string;
	ChildItem?: IProcurementCommonOverviewEntity[];
}

export interface IModuleInfoEntity {
	id: number;
	Uuid: string;
	ParentUuid: string;
	Container: string;
	Level: number;
	Title: string;
}
