/*
 * Copyright(c) RIB Software GmbH
 */

import { IMdcTaxCodeEntity } from './mdc-tax-code-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMdcTaxCodeMatrixEntityGenerated extends IEntityBase {

  /**
   * BasVatcalculationtypeFk
   */
  BasVatcalculationtypeFk: number;

  /**
   * BasVatclauseFk
   */
  BasVatclauseFk?: number | null;

  /**
   * BpdVatgroupFk
   */
  BpdVatgroupFk: number;

  /**
   * Code
   */
  Code: string;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * MdcTaxCodeEntity
   */
  MdcTaxCodeEntity?: IMdcTaxCodeEntity | null;

  /**
   * MdcTaxCodeFk
   */
  MdcTaxCodeFk: number;

  /**
   * TaxCategory
   */
  TaxCategory?: string | null;

  /**
   * UserDefined1
   */
  UserDefined1?: string | null;

  /**
   * UserDefined2
   */
  UserDefined2?: string | null;

  /**
   * UserDefined3
   */
  UserDefined3?: string | null;

  /**
   * VatPercent
   */
  VatPercent: number;
}
