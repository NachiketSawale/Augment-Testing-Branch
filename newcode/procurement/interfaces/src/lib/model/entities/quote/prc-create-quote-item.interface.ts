/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { IQuoteHeaderEntity } from './quote-header-entity.interface';

export interface IQuoteItem {
	RfqHeaderFk?: number;
	ProjectFk?: number;
}

export interface IQuoteResponse {
	PrcTotalsDto?: IPrcCommonTotalEntity|null
	QuoteHeader: IQuoteHeaderEntity;
}

//IPrcCommonTotalEntity will be removed once it is available within the interface module itself. Since IPrcCommonTotalEntity is already present in the Prc.common module, importing it from Prc.common would create a circular dependency. Therefore, we have temporarily created it here.
export interface IPrcCommonTotalEntity extends IEntityBase, IEntityIdentification {
  CommentText?: string;
  Gross?: number;
  GrossOc?: number;
  HeaderFk: number;
  TotalKindFk?: number;
  TotalTypeFk: number;
  ValueNet: number;
  ValueNetOc: number;
  ValueTax: number;
  ValueTaxOc: number;
}

export interface ICreateQuoteEntity {
  ProjectFk: number | null;
  RfqHeaderFk: number | null ;
  Bidders: IPrcRfqbiddersGroup[];
  SupplierGroup: {
    PaymentFromSupplier: boolean;
    BusinessPartnerFk: number | null;
  };
}
export interface IPrcRfqbiddersGroup {
  Selected?: boolean;
  UpdateWithQuoteData?: boolean;
  PaymentFromSupplierPerBid?: boolean;
  UpdateWithReqData?: boolean;
  RfqBusinesspartnerStatusFk?: number;
  BusinessPartnerFk?: number;
  SubsidiaryFk?: number;
  QuoteVersion?: number;
  BusinessPartnerDescriptor?: string | null;
  BpSubsidiaryDescription?: string | null;
  BpSubsidiaryTel?: string | null;
  BpSubsidiaryFax?: string | null;
  SubsidiaryAddress?: string | null;
  SupplierDescriptor?: string | null;
  ContactDescriptor?: string | null;
  PrcCommunicationChannelDescriptor?: string | null;
  RfqBusinesspartnerStatusDescriptor?: string | null;
  RfqRejectionReasonDescriptor?: string | null;
  FirstQuoteFrom?: string | null;
  ContactHasPortalUser?: boolean;
  HasReqVariantAssigned?: boolean;
  Id?: number;
  RfqHeaderFk?: number;
  ContactFk?: number;
  SupplierFk?: number | null;
  InsertedAt?: string;
  InsertedBy?: number;
  UpdatedAt?: string | null;
  UpdatedBy?: number | null;
  Version?: number;
  PrcCommunicationChannelFk?: number;
  DateRequested?: string | null;
  RfqRejectionReasonFk?: number | null;
  DateRejected?: string | null;
  Comments?: string | null;
  ExtendedDate?: string | null;
}

export interface ICreateItemOptions {
  fillSelectedItem: (quoteItem: IQuoteItem) => void;
  onCreateSucceeded: (data: IQuoteResponse[]) => void;
  needCopyRfqTotals: boolean;
  isCreateByMaterials: boolean;
  hasContractItem: boolean;
  isCreateByRfq: boolean;
  uuid?: string;
}