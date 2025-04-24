/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOrdHeaderEntity } from './ord-header-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IOrdHeaderEntityGenerated extends IEntityBase {

/*
 * AmountGross
 */
  AmountGross?: number | null;

/*
 * AmountGrossOc
 */
  AmountGrossOc?: number | null;

/*
 * AmountNet
 */
  AmountNet?: number | null;

/*
 * AmountNetOc
 */
  AmountNetOc?: number | null;

/*
 * BasBlobsBillToPartyFk
 */
  BasBlobsBillToPartyFk?: number | null;

/*
 * BasBlobsFooterFk
 */
  BasBlobsFooterFk?: number | null;

/*
 * BasBlobsHeaderFk
 */
  BasBlobsHeaderFk?: number | null;

/*
 * BasBlobsReferenceFk
 */
  BasBlobsReferenceFk?: number | null;

/*
 * BasBlobsSalutationFk
 */
  BasBlobsSalutationFk?: number | null;

/*
 * BasBlobsSubjectFk
 */
  BasBlobsSubjectFk?: number | null;

/*
 * BasCashprojectionFk
 */
  BasCashprojectionFk?: number | null;

/*
 * BasClerkFk
 */
  BasClerkFk?: number | null;

/*
 * BasClobsBillToPartyFk
 */
  BasClobsBillToPartyFk?: number | null;

/*
 * BasClobsFooterFk
 */
  BasClobsFooterFk?: number | null;

/*
 * BasClobsHeaderFk
 */
  BasClobsHeaderFk?: number | null;

/*
 * BasClobsReferenceFk
 */
  BasClobsReferenceFk?: number | null;

/*
 * BasClobsSalutationFk
 */
  BasClobsSalutationFk?: number | null;

/*
 * BasClobsSubjectFk
 */
  BasClobsSubjectFk?: number | null;

/*
 * BasCompanyFk
 */
  BasCompanyFk?: number | null;

/*
 * BasCompanyResponsibleFk
 */
  BasCompanyResponsibleFk?: number | null;

/*
 * BasCurrencyFk
 */
  BasCurrencyFk?: number | null;

/*
 * BasLanguageFk
 */
  BasLanguageFk?: number | null;

/*
 * BasPaymentTermAdFk
 */
  BasPaymentTermAdFk?: number | null;

/*
 * BasPaymentTermFiFk
 */
  BasPaymentTermFiFk?: number | null;

/*
 * BasPaymentTermPaFk
 */
  BasPaymentTermPaFk?: number | null;

/*
 * BasRubricCategoryFk
 */
  BasRubricCategoryFk?: number | null;

/*
 * BidHeaderFk
 */
  BidHeaderFk?: number | null;

/*
 * BilltoFk
 */
  BilltoFk?: number | null;

/*
 * BpdBankFk
 */
  BpdBankFk?: number | null;

/*
 * BpdBusinesspartnerBilltoFk
 */
  BpdBusinesspartnerBilltoFk?: number | null;

/*
 * BpdBusinesspartnerFk
 */
  BpdBusinesspartnerFk?: number | null;

/*
 * BpdContactBilltoFk
 */
  BpdContactBilltoFk?: number | null;

/*
 * BpdContactFk
 */
  BpdContactFk?: number | null;

/*
 * BpdCustomerBilltoFk
 */
  BpdCustomerBilltoFk?: number | null;

/*
 * BpdCustomerFk
 */
  BpdCustomerFk?: number | null;

/*
 * BpdSubsidiaryBilltoFk
 */
  BpdSubsidiaryBilltoFk?: number | null;

/*
 * BpdSubsidiaryFk
 */
  BpdSubsidiaryFk?: number | null;

/*
 * BpdVatgroupFk
 */
  BpdVatgroupFk?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * DateEffective
 */
  DateEffective?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * Exchangerate
 */
  Exchangerate?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IndirectcostbalCfgdetailFk
 */
  IndirectcostbalCfgdetailFk?: number | null;

/*
 * IsTransferred
 */
  IsTransferred?: boolean | null;

/*
 * Isdays
 */
  Isdays?: boolean | null;

/*
 * Iswarrenty
 */
  Iswarrenty?: boolean | null;

/*
 * MdcBillingSchemaFk
 */
  MdcBillingSchemaFk?: number | null;

/*
 * MdcControllingUnitFk
 */
  MdcControllingUnitFk?: number | null;

/*
 * MdcTaxCodeFk
 */
  MdcTaxCodeFk?: number | null;

/*
 * ObjUnitFk
 */
  ObjUnitFk?: number | null;

/*
 * OrdConditionFk
 */
  OrdConditionFk?: number | null;

/*
 * OrdHeaderEntities_OrdHeaderFk
 */
  OrdHeaderEntities_OrdHeaderFk?: IOrdHeaderEntity[] | null;

/*
 * OrdHeaderEntity_OrdHeaderFk
 */
  OrdHeaderEntity_OrdHeaderFk?: IOrdHeaderEntity | null;

/*
 * OrdHeaderFk
 */
  OrdHeaderFk?: number | null;

/*
 * OrdStatusFk
 */
  OrdStatusFk?: number | null;

/*
 * OrdWarrentyTypeFk
 */
  OrdWarrentyTypeFk?: number | null;

/*
 * OrderDate
 */
  OrderDate?: string | null;

/*
 * OrdernoCustomer
 */
  OrdernoCustomer?: string | null;

/*
 * PlannedEnd
 */
  PlannedEnd?: string | null;

/*
 * PlannedStart
 */
  PlannedStart?: string | null;

/*
 * PrcConfigurationFk
 */
  PrcConfigurationFk?: number | null;

/*
 * PrcIncotermFk
 */
  PrcIncotermFk?: number | null;

/*
 * PrcStructureFk
 */
  PrcStructureFk?: number | null;

/*
 * PrjChangeFk
 */
  PrjChangeFk?: number | null;

/*
 * PrjContractTypeFk
 */
  PrjContractTypeFk?: number | null;

/*
 * PrjProjectFk
 */
  PrjProjectFk?: number | null;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * RevisionApplicable
 */
  RevisionApplicable?: boolean | null;

/*
 * SearchPattern
 */
  SearchPattern?: string | null;

/*
 * Total
 */
  Total?: number | null;

/*
 * Userdefined1
 */
  Userdefined1?: string | null;

/*
 * Userdefined2
 */
  Userdefined2?: string | null;

/*
 * Userdefined3
 */
  Userdefined3?: string | null;

/*
 * Userdefined4
 */
  Userdefined4?: string | null;

/*
 * Userdefined5
 */
  Userdefined5?: string | null;

/*
 * Userdefineddate01
 */
  Userdefineddate01?: string | null;

/*
 * Userdefineddate02
 */
  Userdefineddate02?: string | null;

/*
 * Userdefineddate03
 */
  Userdefineddate03?: string | null;

/*
 * Userdefineddate04
 */
  Userdefineddate04?: string | null;

/*
 * Userdefineddate05
 */
  Userdefineddate05?: string | null;

/*
 * WarrantyAmount
 */
  WarrantyAmount?: number | null;

/*
 * WipCurrent
 */
  WipCurrent?: number | null;

/*
 * WipDuration
 */
  WipDuration?: number | null;

/*
 * WipFirst
 */
  WipFirst?: string | null;

/*
 * WipFrom
 */
  WipFrom?: string | null;

/*
 * WipTypeFk
 */
  WipTypeFk?: number | null;

/*
 * WipUntil
 */
  WipUntil?: string | null;
}
