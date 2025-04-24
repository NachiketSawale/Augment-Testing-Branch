/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessPartnerDialogComponent } from '../../directives/business-partner-dialog.directive';
import { getCustomDialogDataToken, StandardDialogButtonId } from '@libs/ui/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import {
	BUSINESSPARTNER_LOOKUP_WIZARD_TOKEN,
	BUSINESSPARTNER_WIZARD_INITIAL_VALUE_TOKEN,
	IBusinessPartner2CreateRfqWizardResult,
	IBusinessPartner2EnhanceBidderSearchWizardResult
} from '../../model/interface/business-partner-wizard-options.interface';
import { BusinessPartnerWizardScope } from '../../model/business-partner-wizard-scope';
import { LocationDistanceParameters } from '../../model/business-partner-request';


/**
 * Business Partner Wizard
 */
@Component({
	selector: 'businesspartner-shared-business-partner-wizard',
	templateUrl: '../lookup/business-partner-lookup.component.html',
	styleUrls: ['../lookup/business-partner-lookup.component.scss'],
})

export class BusinessPartnerWizardComponent extends BusinessPartnerDialogComponent implements AfterViewInit, OnInit {

	public override scope = new BusinessPartnerWizardScope();

	private readonly wizardOptions = inject(BUSINESSPARTNER_LOOKUP_WIZARD_TOKEN, {optional: true});
	private readonly wizardInitialValue = inject(BUSINESSPARTNER_WIZARD_INITIAL_VALUE_TOKEN, {optional: true});
	private readonly dialogWrapperEnhanceBidderSearch = inject(getCustomDialogDataToken<IBusinessPartner2EnhanceBidderSearchWizardResult, BusinessPartnerWizardComponent>());
	private readonly dialogWrapperCreateRfq = inject(getCustomDialogDataToken<IBusinessPartner2CreateRfqWizardResult, BusinessPartnerWizardComponent>());

	/**
	 * Used for Enhance Bidder Search
	 */
	public handleEnhanceBidderSearchWizardOkButtonClick() {
		this.scope.processEnhanceBidderSearchWizardResult();
		if (this.scope.enhanceBidderSearchResultWizardResult) {
			this.dialogWrapperEnhanceBidderSearch.value = this.scope.enhanceBidderSearchResultWizardResult;
			this.dialogWrapperEnhanceBidderSearch.close(StandardDialogButtonId.Ok);
		}
	}

	public handleEnhanceBidderSearchWizardOkButtonEnable(): boolean {
		return this.scope.isWizardValid();
	}

	/**
	 * Used for Create Rfq
	 */
	public handleCreateRfqWizardOkButtonClick(skipSearch: boolean = false) {
		this.scope.processCreateRfqWizardResult(skipSearch);
		if (this.scope.createRfqResultWizardResult) {
			this.dialogWrapperCreateRfq.value = this.scope.createRfqResultWizardResult;
			this.dialogWrapperCreateRfq.close(StandardDialogButtonId.Ok);
		}
	}

	public handleCreateRfqWizardOkButtonEnable(): boolean {
		if (this.scope.setting.HasSuggestedBidders) {
			return true;
		}
		return this.scope.isWizardValid();
	}


	protected override onInitialValue() {
		this.scope.clearWizardResult();
		if (this.wizardInitialValue) {
			const initialValue = this.wizardInitialValue.execute();
			this.scope.setting.PrcStructure.SelectedItemFk = initialValue?.structureFk;
			this.scope.setting.HeaderId = this.scope.enhanceBidderSearchResultWizardResult.headerId = initialValue?.prcHeaderFk || initialValue?.rfqHeaderFk;
			this.scope.setting.HasSuggestedBidders = initialValue.suggestedBidders && initialValue.suggestedBidders.length > 0;

			const disParameters = new LocationDistanceParameters();
			disParameters.s_headerFk = initialValue?.conHeaderFk || initialValue?.rfqHeaderFk || initialValue?.prcHeaderFk || null;
			disParameters.addressFk = initialValue?.addressFk;
			disParameters.projectFk = initialValue?.projectFk;
			disParameters.companyFk = initialValue?.companyFk;
			disParameters.moduleName = initialValue?.moduleName;
			this.scope.setting.DistanceParameters = disParameters;
		}

		if (this.wizardOptions) {
			this.scope.initialOptions = {
				...this.scope.initialOptions,
				approvalBPRequired: this.wizardOptions.approvalBPRequired || false,
				showContacts: this.wizardOptions.showContacts || false,
				showBranch: this.wizardOptions.showContacts || false,
				showMultiple: this.wizardOptions.showContacts || false,
				showCopyBidder: this.wizardOptions.showCopyBidder || false,
			};
			this.scope.setting.isEnhanceBidder = this.wizardOptions.isEnhanceBidder || false;
		}
	}
}