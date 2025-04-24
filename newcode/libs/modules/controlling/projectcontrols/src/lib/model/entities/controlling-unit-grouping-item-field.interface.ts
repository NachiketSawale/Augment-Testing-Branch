/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IControllingUnitGroupingItemField {
	/*
	 * AccountFk
	 */
	MdcContrFormulaPropDefFk: number;

	/*
	 * Field
	 */
	Field: string;

	/*
	 * Value
	 */
	Value?: number | null;

	/*
	 * Period
	 */
	Period?: Date | null;
}
