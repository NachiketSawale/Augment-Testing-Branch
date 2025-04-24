/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormEntity } from './form-entity.interface';
import { IQtoFormulaFormDataEntity } from './qto-formula-form-data-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IQtoFormulaEntityGenerated extends IEntityBase {

  /**
   * BlobsFk
   */
  BlobsFk?: number | null;

  /**
   * CalculationFormula
   */
  CalculationFormula?: string | null;

  /**
   * Code
   */
  Code?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * FormEntity
   */
  FormEntity?: IFormEntity | null;

  /**
   * FormFk
   */
  FormFk?: number | null;

  /**
   * Icon
   */
  Icon: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDialog
   */
  IsDialog: boolean;

  /**
   * IsMultiline
   */
  IsMultiline: boolean;

  /**
   * Isdefault
   */
  Isdefault: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * MaxLinenumber
   */
  MaxLinenumber?: number | null;

  /**
   * NumberLines
   */
  NumberLines: number;

  /**
   * Operator1
   */
  Operator1?: string | null;

  /**
   * Operator2
   */
  Operator2?: string | null;

  /**
   * Operator3
   */
  Operator3?: string | null;

  /**
   * Operator4
   */
  Operator4?: string | null;

  /**
   * Operator5
   */
  Operator5?: string | null;

  /**
   * PresentationFormula
   */
  PresentationFormula?: string | null;

  /**
   * QtoFormulaFormdataEntities
   */
  QtoFormulaFormdataEntities?: IQtoFormulaFormDataEntity[] | null;

  /**
   * QtoFormulaTypeFk
   */
  QtoFormulaTypeFk: number;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * Value1isactive
   */
  Value1isactive: boolean;

  /**
   * Value2isactive
   */
  Value2isactive: boolean;

  /**
   * Value3isactive
   */
  Value3isactive: boolean;

  /**
   * Value4isactive
   */
  Value4isactive: boolean;

  /**
   * Value5isactive
   */
  Value5isactive: boolean;
}
