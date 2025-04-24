/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinesspartnerEntity } from './businesspartner-entity.interface';
import { IConHeaderEntity } from './con-header-entity.interface';
import { IInvHeaderFormDataEntity } from './inv-header-form-data-entity.interface';
import { IPesHeaderEntity } from './pes-header-entity.interface';
import { IPrcPackageEntity } from './prc-package-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IInvHeaderEntityGenerated extends IEntityBase {

  /**
   * AmountDiscount
   */
  AmountDiscount: number;

  /**
   * AmountDiscountOc
   */
  AmountDiscountOc: number;

  /**
   * AmountDiscountbasis
   */
  AmountDiscountbasis: number;

  /**
   * AmountDiscountbasisOc
   */
  AmountDiscountbasisOc: number;

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
   * AmountNetcontract
   */
  AmountNetcontract: number;

  /**
   * AmountNetcontractOc
   */
  AmountNetcontractOc: number;

  /**
   * AmountNetother
   */
  AmountNetother: number;

  /**
   * AmountNetotherOc
   */
  AmountNetotherOc: number;

  /**
   * AmountNetpes
   */
  AmountNetpes: number;

  /**
   * AmountNetpesOc
   */
  AmountNetpesOc: number;

  /**
   * AmountNetreject
   */
  AmountNetreject: number;

  /**
   * AmountNetrejectOc
   */
  AmountNetrejectOc: number;

  /**
   * AmountVatcontract
   */
  AmountVatcontract: number;

  /**
   * AmountVatcontractOc
   */
  AmountVatcontractOc: number;

  /**
   * AmountVatother
   */
  AmountVatother: number;

  /**
   * AmountVatotherOc
   */
  AmountVatotherOc: number;

  /**
   * AmountVatpes
   */
  AmountVatpes: number;

  /**
   * AmountVatpesOc
   */
  AmountVatpesOc: number;

  /**
   * AmountVatreject
   */
  AmountVatreject: number;

  /**
   * AmountVatrejectOc
   */
  AmountVatrejectOc: number;

  /**
   * BusinesspartnerEntity
   */
  BusinesspartnerEntity?: IBusinesspartnerEntity | null;

  /**
   * BusinesspartnerFk
   */
  BusinesspartnerFk?: number | null;

  /**
   * ClerkPrcFk
   */
  ClerkPrcFk?: number | null;

  /**
   * ClerkReqFk
   */
  ClerkReqFk?: number | null;

  /**
   * ClerkWfeFk
   */
  ClerkWfeFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CompanyDeferaltypeFk
   */
  CompanyDeferaltypeFk?: number | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * ConHeaderEntity
   */
  ConHeaderEntity?: IConHeaderEntity | null;

  /**
   * ConHeaderFk
   */
  ConHeaderFk?: number | null;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * DateDeferalstart
   */
  DateDeferalstart?: Date | string | null;

  /**
   * DateDelivered
   */
  DateDelivered?: Date | string | null;

  /**
   * DateDelivredfrom
   */
  DateDelivredfrom?: Date | string | null;

  /**
   * DateDiscount
   */
  DateDiscount?: Date | string | null;

  /**
   * DateInvoiced
   */
  DateInvoiced: Date | string;

  /**
   * DateNetpayable
   */
  DateNetpayable?: Date | string | null;

  /**
   * DatePosted
   */
  DatePosted?: Date | string | null;

  /**
   * DateReceived
   */
  DateReceived: Date | string;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Exchangerate
   */
  Exchangerate: number;

  /**
   * Id
   */
  Id: number;

  /**
   * InvGroupFk
   */
  InvGroupFk: number;

  /**
   * InvHeaderFormdataEntities
   */
  InvHeaderFormdataEntities?: IInvHeaderFormDataEntity[] | null;

  /**
   * InvStatusFk
   */
  InvStatusFk: number;

  /**
   * InvTypeFk
   */
  InvTypeFk: number;

  /**
   * MdcBillingSchemaFk
   */
  MdcBillingSchemaFk: number;

  /**
   * MdcControllingunitFk
   */
  MdcControllingunitFk?: number | null;

  /**
   * MdcTaxCodeFk
   */
  MdcTaxCodeFk: number;

  /**
   * PaymentTermFk
   */
  PaymentTermFk?: number | null;

  /**
   * PesHeaderEntity
   */
  PesHeaderEntity?: IPesHeaderEntity | null;

  /**
   * PesHeaderFk
   */
  PesHeaderFk?: number | null;

  /**
   * PrcConfigurationFk
   */
  PrcConfigurationFk: number;

  /**
   * PrcPackageEntity
   */
  PrcPackageEntity?: IPrcPackageEntity | null;

  /**
   * PrcPackageFk
   */
  PrcPackageFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * Progressid
   */
  Progressid: number;

  /**
   * ProjectEntity
   */
  ProjectEntity?: IProjectEntity | null;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * Reconcilationhint
   */
  Reconcilationhint?: string | null;

  /**
   * Reference
   */
  Reference?: string | null;

  /**
   * ReferenceStructured
   */
  ReferenceStructured?: string | null;

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
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * SupplierFk
   */
  SupplierFk?: number | null;

  /**
   * TotalPerformedGross
   */
  TotalPerformedGross: number;

  /**
   * TotalPerformedNet
   */
  TotalPerformedNet: number;

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
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;

  /**
   * VatgroupFk
   */
  VatgroupFk?: number | null;
}
