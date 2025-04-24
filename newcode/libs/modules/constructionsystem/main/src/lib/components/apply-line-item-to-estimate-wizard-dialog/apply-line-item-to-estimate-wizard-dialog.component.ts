/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { COS_APPLY_LINEITEME_TO_ESTIMATE_OPTION_TOKEN } from '../../model/entities/token/cos-apply-lineitem-to-estimate-option.interface';
import { FormsModule } from '@angular/forms';
import { PlatformCommonModule } from '@libs/platform/common';

@Component({
	selector: 'constructionsystem-main-apply-line-item-to-estimate-wizard-dialog',
	templateUrl: './apply-line-item-to-estimate-wizard-dialog.component.html',
	styleUrls: ['./apply-line-item-to-estimate-wizard-dialog.component.scss'],
	standalone: true,
	imports: [FormsModule, PlatformCommonModule],
})
export class ApplyLineItemToEstimateWizardDialogComponent {
	public lineItemToEstimateWizardModelOptions = inject(COS_APPLY_LINEITEME_TO_ESTIMATE_OPTION_TOKEN);
	protected isUpdateAll: boolean = true;
	public constructor() {
		this.isUpdateAll = this.lineItemToEstimateWizardModelOptions.isUpdate;
	}

	protected shouldDisableOptions() {
		return this.lineItemToEstimateWizardModelOptions.updateQuantity || this.lineItemToEstimateWizardModelOptions.updatePrice;
	}

	protected isDisableKeepResPkgAssignment() {
		if (this.shouldDisableOptions()) {
			this.lineItemToEstimateWizardModelOptions.keepResourcePackageAssignment = true;
			return true;
		}
		return this.lineItemToEstimateWizardModelOptions.overwrite;
	}

	protected isDisableDoNotUpdateResIfCosResIsNull() {
		if (this.shouldDisableOptions()) {
			this.lineItemToEstimateWizardModelOptions.doNotUpdateResIfCosResIsNull = true;
			return true;
		}
		return this.lineItemToEstimateWizardModelOptions.overwrite;
	}

	protected isDisable() {
		return this.lineItemToEstimateWizardModelOptions.overwrite;
	}

	protected updateQuantityOnly() {
		this.lineItemToEstimateWizardModelOptions.isUpdate = false;
		this.lineItemToEstimateWizardModelOptions.overwrite = false;
		this.lineItemToEstimateWizardModelOptions.keepResourcePackageAssignment = true;
		this.lineItemToEstimateWizardModelOptions.doNotUpdateResIfCosResIsNull = true;
	}

	protected updatePriceOnly() {
		return this.updateQuantityOnly();
	}

	protected update() {
		this.lineItemToEstimateWizardModelOptions.overwrite = false;
		this.lineItemToEstimateWizardModelOptions.isUpdate = true;
		this.updateQuantityAndPrice(false);
	}

	protected overwrite() {
		this.lineItemToEstimateWizardModelOptions.overwrite = true;
		this.lineItemToEstimateWizardModelOptions.isUpdate = false;
		this.updateQuantityAndPrice(false);
	}

	private updateQuantityAndPrice(value: boolean) {
		this.lineItemToEstimateWizardModelOptions.updateQuantity = value;
		this.lineItemToEstimateWizardModelOptions.updatePrice = value;
	}
}
