/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from './bil-header-entity.interface';
import { ITransactionIcEntity } from './transaction-ic-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ITransactionEntityGenerated extends IEntityBase {

  /**
   * AccountReceiveable
   */
  AccountReceiveable?: string | null;

  /**
   * Amount
   */
  Amount: number;

  /**
   * AmountAuthorized
   */
  AmountAuthorized: number;

  /**
   * Assetno
   */
  Assetno?: string | null;

  /**
   * BilHeaderEntity
   */
  BilHeaderEntity?: IBilHeaderEntity | null;

  /**
   * BilHeaderFk
   */
  BilHeaderFk: number;

  /**
   * BilItemDescription
   */
  BilItemDescription?: string | null;

  /**
   * BoqHeaderFk
   */
  BoqHeaderFk?: number | null;

  /**
   * BoqHeaderWipFk
   */
  BoqHeaderWipFk?: number | null;

  /**
   * BoqItemFk
   */
  BoqItemFk?: number | null;

  /**
   * BoqItemWipFk
   */
  BoqItemWipFk?: number | null;

  /**
   * BusinesspostingGroup
   */
  BusinesspostingGroup?: string | null;

  /**
   * CodeRetention
   */
  CodeRetention?: string | null;

  /**
   * ControllingUnitAssign01
   */
  ControllingUnitAssign01?: string | null;

  /**
   * ControllingUnitAssign01Comment
   */
  ControllingUnitAssign01Comment?: string | null;

  /**
   * ControllingUnitAssign02
   */
  ControllingUnitAssign02?: string | null;

  /**
   * ControllingUnitAssign02Comment
   */
  ControllingUnitAssign02Comment?: string | null;

  /**
   * ControllingUnitAssign03
   */
  ControllingUnitAssign03?: string | null;

  /**
   * ControllingUnitAssign03Comment
   */
  ControllingUnitAssign03Comment?: string | null;

  /**
   * ControllingUnitAssign04
   */
  ControllingUnitAssign04?: string | null;

  /**
   * ControllingUnitAssign04Comment
   */
  ControllingUnitAssign04Comment?: string | null;

  /**
   * ControllingUnitAssign05
   */
  ControllingUnitAssign05?: string | null;

  /**
   * ControllingUnitAssign05Comment
   */
  ControllingUnitAssign05Comment?: string | null;

  /**
   * ControllingUnitAssign06
   */
  ControllingUnitAssign06?: string | null;

  /**
   * ControllingUnitAssign06Comment
   */
  ControllingUnitAssign06Comment?: string | null;

  /**
   * ControllingUnitAssign07
   */
  ControllingUnitAssign07?: string | null;

  /**
   * ControllingUnitAssign07Comment
   */
  ControllingUnitAssign07Comment?: string | null;

  /**
   * ControllingUnitAssign08
   */
  ControllingUnitAssign08?: string | null;

  /**
   * ControllingUnitAssign08Comment
   */
  ControllingUnitAssign08Comment?: string | null;

  /**
   * ControllingUnitAssign09
   */
  ControllingUnitAssign09?: string | null;

  /**
   * ControllingUnitAssign09Comment
   */
  ControllingUnitAssign09Comment?: string | null;

  /**
   * ControllingUnitAssign10
   */
  ControllingUnitAssign10?: string | null;

  /**
   * ControllingUnitAssign10Comment
   */
  ControllingUnitAssign10Comment?: string | null;

  /**
   * ControllingUnitCode
   */
  ControllingUnitCode?: string | null;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * ControllingUnitIcFk
   */
  ControllingUnitIcFk?: number | null;

  /**
   * ControllinggrpsetFk
   */
  ControllinggrpsetFk?: number | null;

  /**
   * ControllingunitAssign01desc
   */
  ControllingunitAssign01desc?: string | null;

  /**
   * ControllingunitAssign02desc
   */
  ControllingunitAssign02desc?: string | null;

  /**
   * ControllingunitAssign03desc
   */
  ControllingunitAssign03desc?: string | null;

  /**
   * ControllingunitAssign04desc
   */
  ControllingunitAssign04desc?: string | null;

  /**
   * ControllingunitAssign05desc
   */
  ControllingunitAssign05desc?: string | null;

  /**
   * ControllingunitAssign06desc
   */
  ControllingunitAssign06desc?: string | null;

  /**
   * ControllingunitAssign07desc
   */
  ControllingunitAssign07desc?: string | null;

  /**
   * ControllingunitAssign08desc
   */
  ControllingunitAssign08desc?: string | null;

  /**
   * ControllingunitAssign09desc
   */
  ControllingunitAssign09desc?: string | null;

  /**
   * ControllingunitAssign10desc
   */
  ControllingunitAssign10desc?: string | null;

  /**
   * Currency
   */
  Currency?: string | null;

  /**
   * Debtor
   */
  Debtor?: string | null;

  /**
   * DebtorGroup
   */
  DebtorGroup?: string | null;

  /**
   * DiscountAmount
   */
  DiscountAmount: number;

  /**
   * DiscountDuedate
   */
  DiscountDuedate?: Date | string | null;

  /**
   * DocumentType
   */
  DocumentType?: string | null;

  /**
   * Documentno
   */
  Documentno?: string | null;

  /**
   * ExtOrderNo
   */
  ExtOrderNo?: string | null;

  /**
   * ExtWipNo
   */
  ExtWipNo?: string | null;

  /**
   * HandoverId
   */
  HandoverId: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsCanceled
   */
  IsCanceled: boolean;

  /**
   * IsDebit
   */
  IsDebit: boolean;

  /**
   * IsProgress
   */
  IsProgress: boolean;

  /**
   * IsSuccess
   */
  IsSuccess: boolean;

  /**
   * ItemFk
   */
  ItemFk?: number | null;

  /**
   * ItemReference
   */
  ItemReference?: number | null;

  /**
   * LineNo
   */
  LineNo?: number | null;

  /**
   * LineReference
   */
  LineReference?: string | null;

  /**
   * LineType
   */
  LineType?: string | null;

  /**
   * NetDuedate
   */
  NetDuedate?: Date | string | null;

  /**
   * NominalAccount
   */
  NominalAccount?: string | null;

  /**
   * NominalAccountFi
   */
  NominalAccountFi?: string | null;

  /**
   * NominalDimension
   */
  NominalDimension?: string | null;

  /**
   * NominalDimension2
   */
  NominalDimension2?: string | null;

  /**
   * NominalDimension3
   */
  NominalDimension3?: string | null;

  /**
   * OrderNumber
   */
  OrderNumber?: string | null;

  /**
   * PaymentTermFk
   */
  PaymentTermFk?: number | null;

  /**
   * PostingDate
   */
  PostingDate: Date | string;

  /**
   * PostingNarritive
   */
  PostingNarritive?: string | null;

  /**
   * PostingType
   */
  PostingType?: string | null;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * ReturnValue
   */
  ReturnValue?: string | null;

  /**
   * TaxCodeFk
   */
  TaxCodeFk?: number | null;

  /**
   * TaxCodeMatrixCode
   */
  TaxCodeMatrixCode?: string | null;

  /**
   * TaxCodeMatrixFk
   */
  TaxCodeMatrixFk?: number | null;

  /**
   * TransactionIcEntities
   */
  TransactionIcEntities?: ITransactionIcEntity[] | null;

  /**
   * TransactionId
   */
  TransactionId: number;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * VatAmount
   */
  VatAmount: number;

  /**
   * VatCode
   */
  VatCode?: string | null;

  /**
   * VatGroupFk
   */
  VatGroupFk?: number | null;

  /**
   * VoucherDate
   */
  VoucherDate?: Date | string | null;

  /**
   * VoucherNumber
   */
  VoucherNumber: string;
}
