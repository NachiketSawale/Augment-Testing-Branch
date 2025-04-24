/*
 * Copyright(c) RIB Software GmbH
 */

import { IBillingSchemaDetailEntity } from './billing-schema-detail-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IBillingSchemaDetailEntityGenerated extends IEntityBase {

  /**
   * AccountNo
   */
  AccountNo?: string | null;

  /**
   * BillingLineTypeFk
   */
  BillingLineTypeFk: number;

  /**
   * BillingSchemaDetailEntities_BillingSchemaDetailTaxFk
   */
  BillingSchemaDetailEntities_BillingSchemaDetailTaxFk?: IBillingSchemaDetailEntity[] | null;

  /**
   * BillingSchemaDetailEntities_DetailAuthorAmountFk
   */
  BillingSchemaDetailEntities_DetailAuthorAmountFk?: IBillingSchemaDetailEntity[] | null;

  /**
   * BillingSchemaDetailEntity_BillingSchemaDetailTaxFk
   */
  BillingSchemaDetailEntity_BillingSchemaDetailTaxFk?: IBillingSchemaDetailEntity | null;

  /**
   * BillingSchemaDetailEntity_DetailAuthorAmountFk
   */
  BillingSchemaDetailEntity_DetailAuthorAmountFk?: IBillingSchemaDetailEntity | null;

  /**
   * BillingSchemaDetailFk
   */
  BillingSchemaDetailFk?: number | null;

  /**
   * BillingSchemaDetailTaxFk
   */
  BillingSchemaDetailTaxFk?: number | null;

  /**
   * BillingSchemaFk
   */
  BillingSchemaFk: number;

  /**
   * CodeRetention
   */
  CodeRetention?: string | null;

  /**
   * CostLineTypeFk
   */
  CostLineTypeFk?: number | null;

  /**
   * CredFactor
   */
  CredFactor?: number | null;

  /**
   * CredLineTypeFk
   */
  CredLineTypeFk?: number | null;

  /**
   * DebFactor
   */
  DebFactor?: number | null;

  /**
   * DebLineTypeFk
   */
  DebLineTypeFk?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Description2Info
   */
  Description2Info?: IDescriptionInfo | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * DetailAuthorAmountFk
   */
  DetailAuthorAmountFk?: number | null;

  /**
   * FinalTotal
   */
  FinalTotal: boolean;

  /**
   * Formula
   */
  Formula?: string | null;

  /**
   * GeneralsTypeFk
   */
  GeneralsTypeFk?: number | null;

  /**
   * Group1
   */
  Group1: boolean;

  /**
   * Group2
   */
  Group2: boolean;

  /**
   * HasControllingUnit
   */
  HasControllingUnit: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * IsBold
   */
  IsBold: boolean;

  /**
   * IsEditable
   */
  IsEditable: boolean;

  /**
   * IsHidden
   */
  IsHidden: boolean;

  /**
   * IsHiddenIfZero
   */
  IsHiddenIfZero: boolean;

  /**
   * IsItalic
   */
  IsItalic: boolean;

  /**
   * IsNetAdjusted
   */
  IsNetAdjusted: boolean;

  /**
   * IsPrinted
   */
  IsPrinted: boolean;

  /**
   * IsPrintedZero
   */
  IsPrintedZero: boolean;

  /**
   * IsResetFI
   */
  IsResetFI: boolean;

  /**
   * IsTurnover
   */
  IsTurnover: boolean;

  /**
   * IsUnderline
   */
  IsUnderline: boolean;

  /**
   * OffsetAccountNo
   */
  OffsetAccountNo?: string | null;

  /**
   * PaymentTermFk
   */
  PaymentTermFk?: number | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * SqlStatement
   */
  SqlStatement?: string | null;

  /**
   * TaxCodeFk
   */
  TaxCodeFk?: number | null;

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
   * Value
   */
  Value: number;
}
