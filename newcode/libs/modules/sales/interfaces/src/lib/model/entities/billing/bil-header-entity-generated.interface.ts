/*
 * Copyright(c) RIB Software GmbH
 */

import { IAccrualEntity } from './accrual-entity.interface';
import { IBil2WipEntity } from './bil-2-wip-entity.interface';
import { IBil2BilEntity } from './bil-2-bil-entity.interface';
import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IBillingschemaEntity } from './billingschema-entity.interface';
import { IBilBoqEntity } from './bil-boq-entity.interface';
import { ICommentEntity } from './comment-entity.interface';
import { IDocumentEntity } from './document-entity.interface';
import { IGeneralsEntity } from './generals-entity.interface';
import { IInvoiceTypeEntity } from './invoice-type-entity.interface';
import { IItemEntity } from './item-entity.interface';
import { IPaymentEntity } from './payment-entity.interface';
import { IBilStatusEntity } from './bil-status-entity.interface';
import { IStatusHistoryEntity } from './status-history-entity.interface';
import { ITransactionEntity } from './transaction-entity.interface';
import { ITransactionIcEntity } from './transaction-ic-entity.interface';
import { ITypeEntity } from './type-entity.interface';
import { IValidationEntity } from './validation-entity.interface';
import { IVoucherTypeEntity } from './voucher-type-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IBilHeaderEntityGenerated extends IEntityBase {

  /**
   * AccrualEntities
   */
  AccrualEntities?: IAccrualEntity[] | null;

  /**
   * AmountGross
   */
  AmountGross: number;

  /**
   * AmountGrossOc
   */
  AmountGrossOc: number;

  /**
   * AmountNet
   */
  AmountNet: number;

  /**
   * AmountNetOc
   */
  AmountNetOc: number;

  /**
   * AmountTotal
   */
  AmountTotal?: number | null;

  /**
   * BankFk
   */
  BankFk?: number | null;

  /**
   * BankTypeFk
   */
  BankTypeFk?: number | null;

  /**
   * BasSalesTaxMethodFk
   */
  BasSalesTaxMethodFk: number;

  /**
   * Bil2WipEntities
   */
  Bil2WipEntities?: IBil2WipEntity[] | null;

  /**
   * Bil2bilEntities_BilBeforeHeaderFk
   */
  Bil2bilEntities_BilBeforeHeaderFk?: IBil2BilEntity[] | null;

  /**
   * Bil2bilEntities_BilHeaderFk
   */
  Bil2bilEntities_BilHeaderFk?: IBil2BilEntity[] | null;

  /**
   * BilHeaderEntities_HeaderFk
   */
  BilHeaderEntities_HeaderFk?: IBilHeaderEntity[] | null;

  /**
   * BilHeaderEntity_HeaderFk
   */
  BilHeaderEntity_HeaderFk?: IBilHeaderEntity | null;

  /**
   * BilStatusFk
   */
  BilStatusFk: number;

  /**
   * BillDate
   */
  BillDate?: Date | string | null;

  /**
   * BillNo
   */
  BillNo: string;

  /**
   * BillingSchemaFk
   */
  BillingSchemaFk: number;

  /**
   * BillingschemaEntities
   */
  BillingschemaEntities?: IBillingschemaEntity[] | null;

  /**
   * BlobsBillToPartyFk
   */
  BlobsBillToPartyFk?: number | null;

  /**
   * BlobsFooterFk
   */
  BlobsFooterFk?: number | null;

  /**
   * BlobsHeaderFk
   */
  BlobsHeaderFk?: number | null;

  /**
   * BlobsReferenceFk
   */
  BlobsReferenceFk?: number | null;

  /**
   * BlobsSalutationFk
   */
  BlobsSalutationFk?: number | null;

  /**
   * BlobsSubjectFk
   */
  BlobsSubjectFk?: number | null;

  /**
   * BookingText
   */
  BookingText?: string | null;

  /**
   * BoqEntities
   */
  BoqEntities?: IBilBoqEntity[] | null;

  /**
   * BusinesspartnerBilltoFk
   */
  BusinesspartnerBilltoFk?: number | null;

  /**
   * BusinesspartnerFk
   */
  BusinesspartnerFk: number;

  /**
   * CancellationDate
   */
  CancellationDate?: Date | string | null;

  /**
   * CancellationNo
   */
  CancellationNo?: string | null;

  /**
   * CancellationReason
   */
  CancellationReason?: string | null;

  /**
   * ClerkFk
   */
  ClerkFk: number;

  /**
   * ClobsBillToPartyFk
   */
  ClobsBillToPartyFk?: number | null;

  /**
   * ClobsFooterFk
   */
  ClobsFooterFk?: number | null;

  /**
   * ClobsHeaderFk
   */
  ClobsHeaderFk?: number | null;

  /**
   * ClobsReferenceFk
   */
  ClobsReferenceFk?: number | null;

  /**
   * ClobsSalutationFk
   */
  ClobsSalutationFk?: number | null;

  /**
   * ClobsSubjectFk
   */
  ClobsSubjectFk?: number | null;

  /**
   * Code
   */
  Code?: string | null;

  /**
   * CommentEntities
   */
  CommentEntities?: ICommentEntity[] | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CompanyIcDebtorFk
   */
  CompanyIcDebtorFk?: number | null;

  /**
   * CompanyResponsibleFk
   */
  CompanyResponsibleFk: number;

  /**
   * ConfigurationFk
   */
  ConfigurationFk?: number | null;

  /**
   * ConsecutiveBillNo
   */
  ConsecutiveBillNo?: string | null;

  /**
   * ContactBilltoFk
   */
  ContactBilltoFk?: number | null;

  /**
   * ContactFk
   */
  ContactFk?: number | null;

  /**
   * ContractCurrencyFk
   */
  ContractCurrencyFk: number;

  /**
   * ContractTypeFk
   */
  ContractTypeFk: number;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * CustomerBilltoFk
   */
  CustomerBilltoFk?: number | null;

  /**
   * CustomerFk
   */
  CustomerFk: number;

  /**
   * DateDiscount
   */
  DateDiscount?: Date | string | null;

  /**
   * DateEffective
   */
  DateEffective: Date | string;

  /**
   * DateNetpayable
   */
  DateNetpayable?: Date | string | null;

  /**
   * DatePosted
   */
  DatePosted?: Date | string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * DiscountAmountTotal
   */
  DiscountAmountTotal?: number | null;

  /**
   * DocumentEntities
   */
  DocumentEntities?: IDocumentEntity[] | null;

  /**
   * DocumentNo
   */
  DocumentNo?: string | null;

  /**
   * ExchangeRate
   */
  ExchangeRate: number;

  /**
   * FinalGroup
   */
  FinalGroup?: number | null;

  /**
   * FromBillingSchemaNet
   */
  FromBillingSchemaNet: number;

  /**
   * FromBillingSchemaNetOc
   */
  FromBillingSchemaNetOc: number;

  /**
   * FromBillingSchemaVat
   */
  FromBillingSchemaVat: number;

  /**
   * FromBillingSchemaVatOc
   */
  FromBillingSchemaVatOc: number;

  /**
   * GeneralsEntities
   */
  GeneralsEntities?: IGeneralsEntity[] | null;

  /**
   * Id
   */
  Id: number;

  /**
   * InvoiceTypeEntity
   */
  InvoiceTypeEntity?: IInvoiceTypeEntity | null;

  /**
   * InvoiceTypeFk
   */
  InvoiceTypeFk: number;

  /**
   * IsBilled
   */
  IsBilled: boolean;

  /**
   * IsCanceled
   */
  IsCanceled: boolean;

  /**
   * IsConfirmToDeleteBillWithQto
   */
  IsConfirmToDeleteBillWithQto: boolean;

  /**
   * IsContractRelated
   */
  IsContractRelated: boolean;

  /**
   * IsDiverseDebitorsAllowed
   */
  IsDiverseDebitorsAllowed: boolean;

  /**
   * IsNotAccrual
   */
  IsNotAccrual: boolean;

  /**
   * IsReadOnly
   */
  IsReadOnly: boolean;

  /**
   * IsRecharging
   */
  IsRecharging: boolean;

  /**
   * IsReferencedByOrdPaymentSchedule
   */
  IsReferencedByOrdPaymentSchedule: boolean;

  /**
   * IsWipOrder
   */
  IsWipOrder: boolean;

  /**
   * ItemEntities
   */
  ItemEntities?: IItemEntity[] | null;

  /**
   * LanguageFk
   */
  LanguageFk: number;

  /**
   * ObjUnitFk
   */
  ObjUnitFk?: number | null;

  /**
   * OrdConditionFk
   */
  OrdConditionFk?: number | null;

  /**
   * OrdHeaderFk
   */
  OrdHeaderFk?: number | null;

  /**
   * PaymentEntities
   */
  PaymentEntities?: IPaymentEntity[] | null;

  /**
   * PaymentScheduleCode
   */
  PaymentScheduleCode?: string | null;

  /**
   * PaymentTermFiFk
   */
  PaymentTermFiFk?: number | null;

  /**
   * PaymentTermFk
   */
  PaymentTermFk: number;

  /**
   * PaymentTermPaFk
   */
  PaymentTermPaFk?: number | null;

  /**
   * PerformedFrom
   */
  PerformedFrom?: Date | string | null;

  /**
   * PerformedTo
   */
  PerformedTo?: Date | string | null;

  /**
   * PermissionObjectInfo
   */
  PermissionObjectInfo?: string | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * PreviousBillFk
   */
  PreviousBillFk?: number | null;

  /**
   * PreviousBillFkForDeletion
   */
  PreviousBillFkForDeletion?: number | null;

  /**
   * PrjChangeFk
   */
  PrjChangeFk?: number | null;

  /**
   * ProgressInvoiceNo
   */
  ProgressInvoiceNo: number;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * ReferenceStructured
   */
  ReferenceStructured?: string | null;

  /**
   * RelatedBillHeaderFk
   */
  RelatedBillHeaderFk?: number | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * StatusEntity
   */
  StatusEntity?: IBilStatusEntity | null;

  /**
   * StatushistoryEntities
   */
  StatushistoryEntities?: IStatusHistoryEntity[] | null;

  /**
   * SubsidiaryBilltoFk
   */
  SubsidiaryBilltoFk?: number | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk: number;

  /**
   * TaxCodeFk
   */
  TaxCodeFk: number;

  /**
   * TransactionEntities
   */
  TransactionEntities?: ITransactionEntity[] | null;

  /**
   * TransactionIcEntities
   */
  TransactionIcEntities?: ITransactionIcEntity[] | null;

  /**
   * TypeEntity
   */
  TypeEntity?: ITypeEntity | null;

  /**
   * TypeFk
   */
  TypeFk: number;

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
   * UserDefined4
   */
  UserDefined4?: string | null;

  /**
   * UserDefined5
   */
  UserDefined5?: string | null;

  /**
   * UserDefinedDate01
   */
  UserDefinedDate01?: Date | string | null;

  /**
   * UserDefinedDate02
   */
  UserDefinedDate02?: Date | string | null;

  /**
   * UserDefinedDate03
   */
  UserDefinedDate03?: Date | string | null;

  /**
   * UserDefinedDate04
   */
  UserDefinedDate04?: Date | string | null;

  /**
   * UserDefinedDate05
   */
  UserDefinedDate05?: Date | string | null;

  /**
   * ValidationEntities
   */
  ValidationEntities?: IValidationEntity[] | null;

  /**
   * VatGroupFk
   */
  VatGroupFk?: number | null;

  /**
   * VoucherTypeEntity
   */
  VoucherTypeEntity?: IVoucherTypeEntity | null;

  /**
   * VoucherTypeFk
   */
  VoucherTypeFk?: number | null;
}
