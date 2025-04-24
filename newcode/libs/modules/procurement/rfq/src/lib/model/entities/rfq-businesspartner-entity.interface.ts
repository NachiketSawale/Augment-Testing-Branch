/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { IContactLookupEntity, ISupplierLookupEntity } from '@libs/businesspartner/shared';
import { LookupSimpleEntity } from '@libs/ui/common';
import { IRfqBusinesspartnerStatusEntity, IRfqRejectionReasonEntity } from '@libs/procurement/shared';
import { IBusinessPartnerSearchMainEntity, SubsidiaryEntity } from '@libs/businesspartner/interfaces';

export interface IRfqBusinessPartnerResponse {
	Main: IRfqBusinessPartnerEntity[];
	BusinessPartner: IBusinessPartnerSearchMainEntity[];
	Contact: IContactLookupEntity[];
	PrcCommunicationChannel: LookupSimpleEntity[];
	RfqBusinessPartnerStatus: IRfqBusinesspartnerStatusEntity[];
	RfqRejectionReason: IRfqRejectionReasonEntity[];
	Subsidiary: SubsidiaryEntity[];
	Supplier: ISupplierLookupEntity[];
}

/**
 *
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
}