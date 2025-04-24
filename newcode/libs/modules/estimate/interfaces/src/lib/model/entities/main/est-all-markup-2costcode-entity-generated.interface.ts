/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import {IEstAllMarkup2costcodeEntity} from './est-all-markup-2costcode-entity.interface';

export interface IEstAllMarkup2costcodeEntityGenerated extends IEntityBase {

/*
 * AllowanceValue
 */
  AllowanceValue: number;

/*
 * AmPerc
 */
  AmPerc?: number | null;

/*
 * AmValue
 */
  AmValue: number;

/*
 * CostCode
 */
  CostCode?: string | null;

/*
 * CostCodeMainId
 */
  CostCodeMainId: number | null;

/*
 * CostCodeParentFk
 */
  CostCodeParentFk?: number | null;

/*
 * CostCodes
 */
  CostCodes: IEstAllMarkup2costcodeEntity[] | null;

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
  DjcTotal: number;

/*
 * DjcTotalOp
 */
  DjcTotalOp: number;

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
  FmValue: number;

/*
 * GaPerc
 */
  GaPerc?: number | null;

/*
 * GaValue
 */
  GaValue: number;

/*
 * GcTotal
 */
  GcTotal: number;

/*
 * GcValue
 */
  GcValue: number;

/*
 * GraPerc
 */
  GraPerc?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsCustomProjectCostCode
 */
  IsCustomProjectCostCode?: boolean | null;

/*
 * MdcCostCodeFk
 */
  MdcCostCodeFk: number | null;

/*
 * Project2MdcCstCdeFk
 */
  Project2MdcCstCdeFk: number | null;

/*
 * RpPerc
 */
  RpPerc?: number | null;

/*
 * RpValue
 */
  RpValue: number;
}
