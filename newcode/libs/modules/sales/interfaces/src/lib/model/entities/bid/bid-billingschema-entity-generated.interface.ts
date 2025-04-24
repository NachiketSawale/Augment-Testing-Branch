/*
 * Copyright(c) RIB Software GmbH
 */

import { IBidBillingschemaEntity } from './bid-billingschema-entity.interface';
import { IBidHeaderEntity } from './bid-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBidBillingschemaEntityGenerated extends IEntityBase {

  /**
   * AccountNo
   */
  AccountNo?: string | null;

  /**
   * BasPaymentTermFk
   */
  BasPaymentTermFk?: number | null;

  /**
   * BidBillingschemaEntities_BidBillingschemaFk
   */
  BidBillingschemaEntities_BidBillingschemaFk?: IBidBillingschemaEntity[] | null;

  /**
   * BidBillingschemaEntities_BillingSchemaDetailTaxFk
   */
  BidBillingschemaEntities_BillingSchemaDetailTaxFk?: IBidBillingschemaEntity[] | null;

  /**
   * BidBillingschemaEntities_DetailAuthorAmountFk
   */
  BidBillingschemaEntities_DetailAuthorAmountFk?: IBidBillingschemaEntity[] | null;

  /**
   * BidBillingschemaEntity_BidBillingschemaFk
   */
  BidBillingschemaEntity_BidBillingschemaFk?: IBidBillingschemaEntity | null;

  /**
   * BidBillingschemaEntity_BillingSchemaDetailTaxFk
   */
  BidBillingschemaEntity_BillingSchemaDetailTaxFk?: IBidBillingschemaEntity | null;

  /**
   * BidBillingschemaEntity_DetailAuthorAmountFk
   */
  BidBillingschemaEntity_DetailAuthorAmountFk?: IBidBillingschemaEntity | null;

  /**
   * BidHeaderEntity
   */
  BidHeaderEntity?: IBidHeaderEntity | null;

  /**
   * BillingLineTypeFk
   */
  BillingLineTypeFk: number;

  /**
   * BillingSchemaDetailTaxFk
   */
  BillingSchemaDetailTaxFk?: number | null;

  /**
   * BillingSchemaFk
   */
  BillingSchemaFk?: number | null;

  /**
   * CodeRetention
   */
  CodeRetention?: string | null;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

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
   * Description2
   */
  Description2?: string | null;

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
   * HeaderFk
   */
  HeaderFk: number;

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
   * IsItalic
   */
  IsItalic: boolean;

  /**
   * IsModification
   */
  IsModification: boolean;

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
   * IsTurnover
   */
  IsTurnover: boolean;

  /**
   * IsUnderline
   */
  IsUnderline: boolean;

  /**
   * MdcBillingSchemaDetailFk
   */
  MdcBillingSchemaDetailFk?: number | null;

  /**
   * OffsetAccountNo
   */
  OffsetAccountNo?: string | null;

  /**
   * Result
   */
  Result: number;

  /**
   * ResultOc
   */
  ResultOc: number;

  /**
   * Sorting
   */
  Sorting: number;

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
