/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICustomCharacteristicGroup {
	Id: number;
	SectionId: number;
	Description: string;
	HasChildren: boolean;
	Children: ICustomCharacteristicGroup[];
}