/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IPpsPlannedQuantitySlotEntityGenerated extends IEntityBase {

	/*
	 * BasUomFk
	 */
	BasUomFk?: number | null;

	/*
	 * CharacteristicFk
	 */
	CharacteristicFk?: number | null;

	/*
	 * ColumnNameInfo
	 */
	ColumnNameInfo?: IDescriptionInfo | null;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * FormulaParameter
	 */
	FormulaParameter?: string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * MdcCostCodeFk
	 */
	MdcCostCodeFk?: number | null;

	/*
	 * MdcMaterialFk
	 */
	MdcMaterialFk?: number | null;

	/*
	 * MdcProductDescriptionFk
	 */
	MdcProductDescriptionFk?: number | null;

	/*
	 * PpsPlannedQuantityTypeFk
	 */
	PpsPlannedQuantityTypeFk?: number | null;

	/*
	 * Property
	 */
	Property?: number | null;

	/*
	 * Result
	 */
	Result?: string | null;

	/*
	 * Userdefined1
	 */
	Userdefined1?: string | null;

	/*
	 * Userdefined2
	 */
	Userdefined2?: string | null;

	/*
	 * Userdefined3
	 */
	Userdefined3?: string | null;

	/*
	 * Userdefined4
	 */
	Userdefined4?: string | null;

	/*
	 * Userdefined5
	 */
	Userdefined5?: string | null;
}
