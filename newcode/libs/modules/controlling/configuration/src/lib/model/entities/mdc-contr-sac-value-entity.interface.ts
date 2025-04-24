/*
 * Copyright(c) RIB Software GmbH
 */

export interface IMdcContrSacValueEntity {
	Id: number;
	MdcContrStructureConfFk?: number;
	RelCoFk: number;
	RelConccFk: number;
	basContrColumnTypeFk?: number;
	MdcContrFormulaPropDefFk: number;
	Value: number | null;
	Period: string;
	isModified?: boolean | false;
}
