/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { BusinessPartnerSearchService } from '../services/business-partner-search.service';
import { BusinessPartnerSetting } from './business-partner-setting';
import { IBusinessPartnerLookupOptions } from '../model/interface/business-partner-lookup-options.interface';
import { IBusinessPartnerWizardOptions } from '../model/interface/business-partner-wizard-options.interface';
import { BusinessPartnerSearchMainEntityGridService } from '../services/entity-grid-service/business-partner-search-main-entity-grid.service';
import { BusinessPartnerSearchSubsidiaryEntityGridService } from '../services/entity-grid-service/business-partner-search-subsidiary-entity-grid.service';
import { BusinessPartnerSearchContactEntityGridService } from '../services/entity-grid-service/business-partner-search-contact-entity-grid.service';
import { BusinessPartnerSearchGuarantorEntityGridService } from '../services/entity-grid-service/business-partner-search-guarantor-entity-grid.service';
import { PlatformTranslateService } from '@libs/platform/common';
import { IBusinessPartnerSearchMainEntity } from '@libs/businesspartner/interfaces';


/**
 * Business Partner search scope which used to store state and communicate among child components
 */



type IBusinessPartnerInitialOptions = Required<IBusinessPartnerLookupOptions> & Required<IBusinessPartnerWizardOptions>;


export class BusinessPartnerScope {

	public setting = new BusinessPartnerSetting();
	public loading = false;

	public selectedItem?: IBusinessPartnerSearchMainEntity;
	public initialOptions: IBusinessPartnerInitialOptions = {
		showCopyBidder: false,
		showMultiple: false,
		showContacts: false,
		showBranch: false,
		showGuarantor: false,
		approvalBPRequired: false,
		isEnhanceBidder: false,
	};


	public readonly searchService = inject(BusinessPartnerSearchService);
	public readonly mainGridService = inject(BusinessPartnerSearchMainEntityGridService);
	public readonly subsidiaryGridService = inject(BusinessPartnerSearchSubsidiaryEntityGridService);
	public readonly contactGridService = inject(BusinessPartnerSearchContactEntityGridService);
	public readonly guarantorGridService = inject(BusinessPartnerSearchGuarantorEntityGridService);
	public readonly translateService = inject(PlatformTranslateService);

	public get initialOptions$() {
		return this.initialOptions;
	}

	/**
	 * Search Business Partner
	 */
	public search() {
		this.loading = true;
		this.searchService.getSearchList(this.setting).subscribe(res => {
			this.loading = false;
			this.searchService.sendSearchData(res);
		});
	}
}