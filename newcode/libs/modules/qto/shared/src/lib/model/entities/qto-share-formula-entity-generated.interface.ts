/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { BlobsEntity } from '@libs/basics/shared';
import { IQtoShareFormulaScriptEntity } from './qto-share-formula-script-entity.interface';

export interface IQtoShareFormulaEntityGenerated extends IEntityBase {

/*
 * BasBlobsFk
 */
  BasBlobsFk?: number | null;

/*
 * BasFormFk
 */
  BasFormFk?: number | null;

/*
 * BasRubricCategoryFk
 */
  BasRubricCategoryFk?: number | null;

/*
 * Blob
 */
  Blob?: BlobsEntity | null;

/*
 * CalculationFormula
 */
  CalculationFormula?: string | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Icon
 */
  Icon?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsDialog
 */
  IsDialog?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * IsMultiline
 */
  IsMultiline?: boolean | null;

/*
 * MaxLinenumber
 */
  MaxLinenumber?: number | null;

/*
 * NumberLines
 */
  NumberLines?: number | null;

/*
 * Operator1
 */
  Operator1?: string | null;

/*
 * Operator2
 */
  Operator2?: string | null;

/*
 * Operator3
 */
  Operator3?: string | null;

/*
 * Operator4
 */
  Operator4?: string | null;

/*
 * Operator5
 */
  Operator5?: string | null;

/*
 * PresentationFormula
 */
  PresentationFormula?: string | null;

/*
 * QtoFormulaScriptEntities
 */
  QtoFormulaScriptEntities?: IQtoShareFormulaScriptEntity[] | null;

/*
 * QtoFormulaTypeFk
 */
  QtoFormulaTypeFk: number;


/*
 * QtoTypeDescription
 */
  QtoTypeDescription?: string | null;

/*
 * Sorting
 */
  Sorting?: number | null;

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
