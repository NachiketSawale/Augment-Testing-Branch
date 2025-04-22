/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';


/**
 * Represents the entity configuration for RFQ business partner.
 */
export interface IRfqBusinessPartnerEntity extends IEntityBase, IEntityIdentification {
	/*
	 * BpSubsidiaryDescription
	 */
	BpSubsidiaryDescription?: string | null;

	/*
	 * BpSubsidiaryFax
	 */
	BpSubsidiaryFax?: string | null;

	/*
	 * BpSubsidiaryTel
	 */
	BpSubsidiaryTel?: string | null;

	/*
	 * BusinessPartnerFk
	 */
	BusinessPartnerFk: number;

	/*
	 * Comments
	 */
	Comments?: string | null;

	/*
	 * ContactFk
	 */
	ContactFk?: number | null;

	/*
	 * ContactHasPortalUser
	 */
	ContactHasPortalUser?: boolean | null;

	/*
	 * DateRejected
	 */
	DateRejected?: string | null;

	/*
	 * DateRequested
	 */
	DateRequested?: string | null;

	/*
	 * ExtendedDate
	 */
	ExtendedDate?: string | null;

	/*
	 * FirstQuoteFrom
	 */
	FirstQuoteFrom?: string | null;

	/*
	 * HasReqVariantAssigned
	 */
	HasReqVariantAssigned?: boolean | null;

	/*
	 * PrcCommunicationChannelFk
	 */
	PrcCommunicationChannelFk: number;

	/*
	 * RfqBusinesspartnerStatusFk
	 */
	RfqBusinesspartnerStatusFk: number;

	/*
	 * RfqHeaderFk
	 */
	RfqHeaderFk: number;

	/*
	 * RfqRejectionReasonFk
	 */
	RfqRejectionReasonFk?: number | null;

	/*
	 * SubsidiaryAddress
	 */
	SubsidiaryAddress?: string | null;

	/*
	 * SubsidiaryFk
	 */
	SubsidiaryFk?: number | null;

	/*
	 * SupplierFk
	 */
	SupplierFk?: number | null;

	/**
	 * BusinessPartnerName1
	 */
	BusinessPartnerName1?: string | null;
}