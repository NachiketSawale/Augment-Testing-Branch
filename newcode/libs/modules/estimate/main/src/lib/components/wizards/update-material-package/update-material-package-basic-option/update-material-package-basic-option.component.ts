/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { EstimateMainService } from '../../../../containers/line-item/estimate-main-line-item-data.service';
import { getMultiStepDialogDataToken } from '@libs/ui/common';
import { IEstimateMainUpdateMaterialPackageDataComplete } from '../../../../model/interfaces/estimate-main-update-material-package.interface';
import { EstimateMainLineItemScopeOption } from '../../../../model/enums/estimate-main-line-item-scope.enum';

@Component({
	selector: 'estimate-main-update-material-package-basic-option',
	templateUrl: './update-material-package-basic-option.component.html',
	styleUrl: './update-material-package-basic-option.component.scss',
})
export class EstimateMainUpdateMaterialPackageBasicOptionComponent {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly estimateMainService = inject(EstimateMainService);
	private readonly dialogData = inject(getMultiStepDialogDataToken<IEstimateMainUpdateMaterialPackageDataComplete>());
	public basicOption: number = this.dialogData.dataItem.basicOption;

	public scopeOptions = [
		{
			value: EstimateMainLineItemScopeOption.SelectedLineItem,
			label: this.translateService.instant('estimate.main.createMaterialPackageWizard.selectedLineItem').text,
			isActive: this.estimateMainService.hasSelection(),
		},
		{
			value: EstimateMainLineItemScopeOption.CurrentResultSet,
			label: this.translateService.instant('estimate.main.createMaterialPackageWizard.currentResultSet').text,
			isActive: true,
		},
		{
			value: EstimateMainLineItemScopeOption.EntireEstimate,
			label: this.translateService.instant('estimate.main.createMaterialPackageWizard.entireEstimate').text,
			isActive: true,
		},
	];
}
