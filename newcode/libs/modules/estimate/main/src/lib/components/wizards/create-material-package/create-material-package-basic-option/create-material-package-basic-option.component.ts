/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, Input } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { FieldType, getMultiStepDialogDataToken, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { EstimateMainService } from '../../../../containers/line-item/estimate-main-line-item-data.service';
import { EstimateMainLineItemScopeOption } from '../../../../model/enums/estimate-main-line-item-scope.enum';
import { EstimateMainCreateMaterialPackageSelectionOption } from '../../../../model/enums/estimate-main-create-material-package.enum';
import { ICreateMatPkgBasicOptionItem, ICreateMatPkgDataComplete } from '../../../../model/interfaces/estimate-main-create-material-package.interface';

@Component({
	selector: 'estimate-main-create-material-package-basic-option',
	templateUrl: './create-material-package-basic-option.component.html',
	styleUrl: './create-material-package-basic-option.component.scss'
})
export class CreateMatPkgBasicOptionComponent {
	private readonly dialogData = inject(getMultiStepDialogDataToken<ICreateMatPkgDataComplete>());
	private lookupFactory = inject(UiCommonLookupDataFactoryService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly estimateMainService = inject(EstimateMainService);
	protected readonly FieldType = FieldType;
	@Input()
	protected optionItem!: ICreateMatPkgBasicOptionItem;
	public readonly estimateMainCreateMaterialPackageSelectionOption = EstimateMainCreateMaterialPackageSelectionOption;
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

	protected readonly selectionLookupService = this.lookupFactory.fromSimpleItemClass([{
		id: EstimateMainCreateMaterialPackageSelectionOption.ProcurementStructure,
		desc: {
			text: 'Structure',
			key: 'estimate.main.createMaterialPackageWizard.procurementStr'
		}
	}, {
		id: EstimateMainCreateMaterialPackageSelectionOption.CostCode,
		desc: {
			text: 'Cost Code',
			key: 'estimate.main.createMaterialPackageWizard.costCode'
		}
	}, {
		id: EstimateMainCreateMaterialPackageSelectionOption.MaterialCatalogAndGroup,
		desc: {
			text: 'Material Catalog And Group',
			key: 'estimate.main.createMaterialPackageWizard.materialCatalogAndGroup'
		}
	}, {
		id: EstimateMainCreateMaterialPackageSelectionOption.MaterialAndCostCode,
		desc: {
			text: 'Material And Cost Code',
			key: 'estimate.main.createMaterialPackageWizard.materialCostCode'
		}
	}], {
		uuid: '52964669ebd543ccb1028b690c90ef9a',
		valueMember: 'id',
		displayMember: 'desc',
		disableInput: true,
		translateDisplayMember: true
	});


	private selectionStep = this.dialogData.getWizardStep('selectionOptions');

	public onIsAllResultTobeChosen() {
		if (this.optionItem.isAllResultTobeChosen) {
			this.dialogData.removeWizardSteps(['selectionOptions']);
		} else if (this.selectionStep != null) {
			this.dialogData.insertWizardStep(this.selectionStep, 1);
		}
	}
}
