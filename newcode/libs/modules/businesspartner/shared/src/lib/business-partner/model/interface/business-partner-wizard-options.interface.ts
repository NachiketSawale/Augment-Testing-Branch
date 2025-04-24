/*
 * Copyright(c) RIB Software GmbH
 */


import { InjectionToken } from '@angular/core';
import { IBusinessPartnerSearchMainEntity } from '@libs/businesspartner/interfaces';


export interface IBusinessPartnerWizardOptions {
	showContacts?: boolean;
	showCopyBidder?: boolean;
	showMultiple?: boolean;
	approvalBPRequired?: boolean;
	isEnhanceBidder?: boolean;
}


export interface IBusinessPartnerWizardInitialEntity {
	structureFk?: number;
	prcHeaderFk?: number;
	rfqHeaderFk?: number;
	conHeaderFk?: number;
	addressFk?: number | null;
	projectFk?: number | null;
	companyFk?: number | null;
	moduleName?: string| null;
	suggestedBidders?: unknown[] | undefined;
}

export interface IBusinessPartnerWizardInitialValue {
	execute(): IBusinessPartnerWizardInitialEntity;
}


export interface IBusinessPartner2EnhanceBidderSearchWizardResult {
	headerId?: number;
	businessPartnerList?: IBusinessPartnerSearchMainEntity[];
	bpMapContactDic?: { [key: number]: number };
	bpMapSubsidiaryDic?: { [key: number]: number };
}


export interface IBusinessPartner2CreateRfqWizardResult {
	AutoCopyBidder?: boolean;
	AutoCopyDefaultContact?: boolean;
	ReqHeaderId?: number;
	PackageId?: number;
	RfqBpWithContact?: { BusinessPartnerFk: number, BPDContactID: number | null | undefined }[];
	bpMapSubsidiaryDic?: { [key: number]: number };
}


/// get Wizard option
export const BUSINESSPARTNER_LOOKUP_WIZARD_TOKEN = new InjectionToken<IBusinessPartnerWizardOptions>('business-partner-wizard-options');

/// get Wizard initial value
export const BUSINESSPARTNER_WIZARD_INITIAL_VALUE_TOKEN = new InjectionToken<IBusinessPartnerWizardInitialValue>('business-partner-wizard-initial-value');
