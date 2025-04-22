/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompareRowEntity } from '../compare-row-entity.interface';
import { ICustomCompareColumnEntity } from '../custom-compare-column-entity.interface';
import { ICompositeBoqEntity } from '../boq/composite-boq-entity.interface';

export interface ICompareExportUserDataBase {
	showInSummaryRows: ICompareRowEntity[];
	leadingField: string,
	visibleCompareRows: ICompareRowEntity[];
	visibleCompareColumns: ICustomCompareColumnEntity[];
}

export interface ICompareExportBoqUserData extends ICompareExportUserDataBase {
	isFinalPriceRowActivated: boolean;
	decimalCompareFields: string[];
	booleanCompareFields: string[];
	integerCompareFields: string[];
	boqRows: ICompositeBoqEntity[];
	isCalculateAsPerAdjustedQuantity: boolean;
}

export interface ICompareExportItemUserData extends ICompareExportUserDataBase {
	isTotalRowActivated: boolean;
}