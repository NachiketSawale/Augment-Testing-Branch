/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from './bil-header-entity.interface';
import { ITransactionEntity } from './transaction-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ITransactionIcEntityGenerated extends IEntityBase {

  /**
   * Amount
   */
  Amount: number;

  /**
   * BilHeaderEntity
   */
  BilHeaderEntity?: IBilHeaderEntity | null;

  /**
   * CompanyCreditorFk
   */
  CompanyCreditorFk: number;

  /**
   * CompanyDebtorFk
   */
  CompanyDebtorFk: number;

  /**
   * HeaderFk
   */
  HeaderFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * InvHeaderFk
   */
  InvHeaderFk?: number | null;

  /**
   * InvOtherFk
   */
  InvOtherFk?: number | null;

  /**
   * MdcControllingUnitFk
   */
  MdcControllingUnitFk?: number | null;

  /**
   * MdcControllingUnitIcFk
   */
  MdcControllingUnitIcFk?: number | null;

  /**
   * MdcTaxCodeFk
   */
  MdcTaxCodeFk?: number | null;

  /**
   * PostingDate
   */
  PostingDate: Date | string;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * TransactionEntity
   */
  TransactionEntity?: ITransactionEntity | null;

  /**
   * TransactionFk
   */
  TransactionFk: number;

  /**
   * UomFk
   */
  UomFk?: number | null;
}
