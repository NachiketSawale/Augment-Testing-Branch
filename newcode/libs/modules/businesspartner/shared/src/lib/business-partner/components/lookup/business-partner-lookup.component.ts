/*
 * Copyright(c) RIB Software GmbH
 */
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { getCustomDialogDataToken, ILookupDialogView, ILookupViewResult, LookupContext, StandardDialogButtonId } from '@libs/ui/common';
import { BUSINESSPARTNER_LOOKUP_INITIAL_VALUE_TOKEN, BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN, IBusinessPartnerLookupInitialValue } from '../../index';
import { BusinessPartnerDialogComponent } from '../../directives/business-partner-dialog.directive';
import { CertificateInfo, LocationDistanceParameters } from '../../model/business-partner-request';
import { IBusinessPartnerSearchMainEntity } from '@libs/businesspartner/interfaces';


/**
 * Business Partner lookup view
 */
@Component({
	selector: 'businesspartner-shared-business-partner-lookup',
	templateUrl: './business-partner-lookup.component.html',
	styleUrls: ['./business-partner-lookup.component.scss']
})
export class BusinessPartnerLookupComponent<TEntity extends object> extends BusinessPartnerDialogComponent
	implements AfterViewInit, OnInit, ILookupDialogView<IBusinessPartnerSearchMainEntity> {

	private readonly lookupContext = inject(LookupContext<IBusinessPartnerSearchMainEntity, TEntity>);

	private readonly lookupOptions = inject(BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN, {optional: true});
	private readonly lookupInitialValue = inject<IBusinessPartnerLookupInitialValue<TEntity>>(BUSINESSPARTNER_LOOKUP_INITIAL_VALUE_TOKEN, {optional: true});
	private readonly dialogWrapper = inject(getCustomDialogDataToken<ILookupViewResult<IBusinessPartnerSearchMainEntity>, BusinessPartnerLookupComponent<TEntity>>());

	public get focusedItem() {
		return this.scope.selectedItem;
	}

	public refresh(): void {
		this.scope.search();
	}

	public apply(dataItem?: IBusinessPartnerSearchMainEntity): void {
		this.dialogWrapper.value = {
			apply: true,
			result: dataItem || this.focusedItem
		};

		this.dialogWrapper.close(StandardDialogButtonId.Ok);
	}

	protected override onInitialValue() {
		if (this.lookupContext) {
			this.scope.setting.SearchText = this.lookupContext.inputValue || '';
		}

		if (this.lookupOptions) {
			this.scope.initialOptions = {
				...this.scope.initialOptions,
				approvalBPRequired: this.lookupOptions.approvalBPRequired || false,
				showContacts: this.lookupOptions.showContacts || false,
				showBranch: this.lookupOptions.showBranch || this.lookupOptions.showContacts || false,
				showGuarantor: this.lookupOptions.showGuarantor || false
			};
		}

		if (this.lookupInitialValue && this.lookupContext?.entity) {
			const initialValue = this.lookupInitialValue.execute(this.lookupContext.entity);
			this.scope.setting.PrcStructure.SelectedItemFk = initialValue?.structureFk;

			if (this.scope.initialOptions.showGuarantor) {
				const certificate = new CertificateInfo();
				certificate.isActive = true;
				certificate.typeId = initialValue?.certificateTypeFk;
				this.scope.setting.Certificate = certificate;
			}

			const disParameters = new LocationDistanceParameters();
			disParameters.isSubModule = initialValue?.isSubModule || false;
			disParameters.s_headerFk = initialValue?.headerFk;
			disParameters.t_headerFk = initialValue?.prcItemFk;
			disParameters.addressFk = initialValue?.addressFk;
			disParameters.projectFk = initialValue?.projectFk;
			disParameters.companyFk = initialValue?.companyFk;
			disParameters.moduleName = initialValue?.moduleName;
			this.scope.setting.DistanceParameters = disParameters;
		}
	}

}
