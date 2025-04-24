/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEstAllMarkup2costcodeBaseEntity extends IEntityBase {

	/*
	 * AllowanceValue
	 */
	AllowanceValue?: number | null;

	/*
	 * AmPerc
	 */
	AmPerc?: number | null;

	/*
	 * AmValue
	 */
	AmValue?: number | null;

	/*
	 * CostCode
	 */
	CostCode?: string | null;

	/*
	 * CostCodeMainId
	 */
	CostCodeMainId?: number | null;

	/*
	 * CostCodeParentFk
	 */
	CostCodeParentFk?: number | null;

	/*
	 * CostCodes
	 */
	//CostCodes?: IICostCodeEntity[] | null;

	/*
	 * DefMGcPerc
	 */
	DefMGcPerc?: number | null;

	/*
	 * DefMGraPerc
	 */
	DefMGraPerc?: number | null;

	/*
	 * DefMOp
	 */
	DefMOp?: number | null;

	/*
	 * DefMPerc
	 */
	DefMPerc?: number | null;

	/*
	 * DjcTotal
	 */
	DjcTotal?: number | null;

	/*
	 * DjcTotalOp
	 */
	DjcTotalOp?: number | null;

	/*
	 * EstAllowanceAreaFk
	 */
	EstAllowanceAreaFk?: number | null;

	/*
	 * EstAllowanceFk
	 */
	EstAllowanceFk?: number | null;

	/*
	 * FinAm
	 */
	FinAm?: number | null;

	/*
	 * FinGa
	 */
	FinGa?: number | null;

	/*
	 * FinM
	 */
	FinM?: number | null;

	/*
	 * FinMGc
	 */
	FinMGc?: number | null;

	/*
	 * FinMGra
	 */
	FinMGra?: number | null;

	/*
	 * FinMOp
	 */
	FinMOp?: number | null;

	/*
	 * FinRp
	 */
	FinRp?: number | null;

	/*
	 * FixedPriceDjcTotal
	 */
	FixedPriceDjcTotal?: number | null;

	/*
	 * FmValue
	 */
	FmValue?: number | null;

	/*
	 * GaPerc
	 */
	GaPerc?: number | null;

	/*
	 * GaValue
	 */
	GaValue?: number | null;

	/*
	 * GcTotal
	 */
	GcTotal?: number | null;

	/*
	 * GcValue
	 */
	GcValue?: number | null;

	/*
	 * GraPerc
	 */
	GraPerc?: number | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * IsCustomProjectCostCode
	 */
	IsCustomProjectCostCode?: boolean | null;

	/*
	 * MdcCostCodeFk
	 */
	MdcCostCodeFk?: number | null;

	/*
	 * Project2MdcCstCdeFk
	 */
	Project2MdcCstCdeFk?: number | null;

	/*
	 * RpPerc
	 */
	RpPerc?: number | null;

	/*
	 * RpValue
	 */
	RpValue?: number | null;
}