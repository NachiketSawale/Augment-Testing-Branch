/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IControllingUnitGroupingItemField } from './controlling-unit-grouping-item-field.interface';

export interface IControllingUnitGroupingItemEntityGenerated {
	/*
	 * ControllingUnitCostCodeFk
	 */
	ControllingUnitCostCodeFk?: number | null;

	/*
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/*
	 * Fields
	 */
	Fields?: IControllingUnitGroupingItemField[] | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * PrjHistoryFk
	 */
	PrjHistoryFk?: number | null;
}
