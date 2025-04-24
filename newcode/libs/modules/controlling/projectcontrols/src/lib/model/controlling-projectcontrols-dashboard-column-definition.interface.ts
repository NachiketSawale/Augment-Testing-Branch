/*
 * Copyright(c) RIB Software GmbH
 */

import { IMdcContrColumnPropDefEntity, IMdcContrFormulaPropDefEntity } from '@libs/controlling/configuration';

export interface IControllingProjectcontrolsDashboardColumnDefinition {
	Id: string;
	Formatter: string;
	Domain: string;
	Field: string;
	Name: string;
	Description: string;
	Width: number;
	Readonly: boolean;
	IsLookupProp: boolean;
	IsFormulaDef: boolean;
	BasContrColumnType: number;
	ToolTip?: string;
	PropDefInfo: IPropDefInfo;
}

export interface IPropDefInfo {
	Type: number;
	Item: IMdcContrColumnPropDefEntity | IMdcContrFormulaPropDefEntity;
}
