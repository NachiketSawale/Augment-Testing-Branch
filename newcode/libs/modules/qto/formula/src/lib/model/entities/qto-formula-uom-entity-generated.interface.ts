/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IQtoFormulaEntity } from './qto-formula-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IQtoFormulaUomEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id?: number | null;

/*
 * NumberLines
 */
  NumberLines?: number | null;

/*
 * Operator1
 */
  Operator1: string;

/*
 * Operator2
 */
  Operator2: string;

/*
 * Operator3
 */
  Operator3: string;

/*
 * Operator4
 */
  Operator4: string;

/*
 * Operator5
 */
  Operator5: string;

/*
 * QtoFormulaEntity
 */
  QtoFormulaEntity?: IQtoFormulaEntity | null;

/*
 * QtoFormulaFk
 */
  QtoFormulaFk?: number | null;

/*
 * UomFk
 */
  UomFk?: number | null;

/*
 * Value1IsActive
 */
  Value1IsActive: boolean;

/*
 * Value2IsActive
 */
  Value2IsActive: boolean;

/*
 * Value3IsActive
 */
  Value3IsActive: boolean;

/*
 * Value4IsActive
 */
  Value4IsActive: boolean;

/*
 * Value5IsActive
 */
  Value5IsActive: boolean;
}
