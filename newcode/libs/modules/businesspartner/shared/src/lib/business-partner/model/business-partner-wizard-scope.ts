/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinessPartner2CreateRfqWizardResult, IBusinessPartner2EnhanceBidderSearchWizardResult } from './interface/business-partner-wizard-options.interface';
import { BusinessPartnerScope } from './business-partner-scope';


/**
 * Business Partner search scope which used to store state and communicate among child components
 */

export class BusinessPartnerWizardScope extends BusinessPartnerScope {

	public enhanceBidderSearchResultWizardResult: IBusinessPartner2EnhanceBidderSearchWizardResult = {};
	public createRfqResultWizardResult: IBusinessPartner2CreateRfqWizardResult = {};

	public processEnhanceBidderSearchWizardResult() {
		const businessPartner = this.mainGridService.selectedEntityList;
		const bpMapSubsidiaryDic: { [key: number]: number } = {};
		const bpMapContactDic: { [key: number]: number } = {};

		const businessPartnerIds = businessPartner.map(e => e.Id);
		this.subsidiaryGridService.selectedEntityList.filter(item => businessPartnerIds.includes(item.BusinessPartnerFk))
			.forEach(item => {
				bpMapSubsidiaryDic[item.BusinessPartnerFk] = item.SubsidiaryFk;
			});

		this.contactGridService.selectedEntityList.filter
			(item => businessPartnerIds.includes(item.BusinessPartnerFk))
			.forEach(item => {
				bpMapContactDic[item.BusinessPartnerFk] = item.ContactFk;
			});

		this.enhanceBidderSearchResultWizardResult = {
			...this.enhanceBidderSearchResultWizardResult,
			businessPartnerList: businessPartner,
			bpMapContactDic: bpMapSubsidiaryDic,
			bpMapSubsidiaryDic: bpMapContactDic
		};
	}

	public processCreateRfqWizardResult(skipSearch: boolean) {
		const businessPartner = this.mainGridService.selectedEntityList;
		const bpMapSubsidiaryDic: { [key: number]: number } = {};
		const rfqBpWithContact: { BusinessPartnerFk: number, BPDContactID: number | null | undefined }[] = [];

		if (!skipSearch) {
			const businessPartnerIds = businessPartner.map(e => e.Id);
			this.subsidiaryGridService.selectedEntityList.filter(item => businessPartnerIds.includes(item.BusinessPartnerFk))
				.forEach(item => {
					bpMapSubsidiaryDic[item.BusinessPartnerFk] = item.SubsidiaryFk;
				});

			this.contactGridService.selectedEntityList.filter
				(item => businessPartnerIds.includes(item.BusinessPartnerFk))
				.forEach(item => {
					rfqBpWithContact.push({BusinessPartnerFk: item.BusinessPartnerFk, BPDContactID: item.ContactFk});
				});
		}

		this.createRfqResultWizardResult = {
			...this.createRfqResultWizardResult,
			AutoCopyBidder: this.setting.CheckBidderCopy,
			RfqBpWithContact: rfqBpWithContact,
			bpMapSubsidiaryDic: bpMapSubsidiaryDic
		};
	}

	public clearWizardResult() {
		this.mainGridService.selectedEntityList = [];
		this.subsidiaryGridService.selectedEntityList = [];
		this.contactGridService.selectedEntityList = [];
	}

	public isWizardValid() {
		return this.mainGridService.selectedEntityList?.length > 0;
	}


}