/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IEstimateMainUpdateMaterialPackageUpdateItemDto } from '../../../../model/interfaces/estimate-main-update-material-package.interface';
import { createLookup, FieldType, IGridConfiguration } from '@libs/ui/common';
import { BasicsSharedPackageStatusLookupService, IUniqueFieldDto, IUniqueFieldOption } from '@libs/basics/shared';
import { PrcSharedPrcConfigLookupService } from '@libs/procurement/shared';
import { EstimateMainUpdateMaterialPackageMergeOrCreate } from '../../../../model/enums/estimate-main-update-material-package.enum';
import { EstimateMainUpdateMaterialPackageWizardService } from '../../../../wizards/estimate-main-update-material-package-wizard.service';

@Component({
	selector: 'estimate-main-update-material-package-update-item',
	templateUrl: './update-material-package-update-item.component.html',
	styleUrl: './update-material-package-update-item.component.scss',
})
export class EstimateMainUpdateMaterialPackageUpdateItemComponent implements OnChanges {
	@Input()
	protected isUpdateBudgetForExistedAssignment!: boolean;
	@Input()
	protected isHideBoqGeneratePackage!: boolean;
	@Input()
	protected isAggregateItem!: boolean;
	@Input()
	protected mergeOrCreate!: number;
	@Input()
	protected uniqueFields!: IUniqueFieldDto[];
	@Input()
	protected updatePackages!: IEstimateMainUpdateMaterialPackageUpdateItemDto[];

	protected showUpdatePackages: IEstimateMainUpdateMaterialPackageUpdateItemDto[] = [];
	protected readonly FieldType = FieldType;
	protected readonly merge = EstimateMainUpdateMaterialPackageMergeOrCreate.Merge;
	protected readonly create = EstimateMainUpdateMaterialPackageMergeOrCreate.Create;


	public uniqueFieldOption: IUniqueFieldOption = {
		identityName: 'generate.packageitem.from.lineitem',
		dynamicUniqueFieldService: inject(EstimateMainUpdateMaterialPackageWizardService)
	};

	public packageGridConfig: IGridConfiguration<IEstimateMainUpdateMaterialPackageUpdateItemDto> = {
		uuid: '0E159038D47E4B51887B472E26B956CF',
		columns: [
			{
				id: 'selected',
				label: {key: 'cloud.common.entitySelected', text: 'Selected'},
				model: 'Selected',
				readonly: false,
				sortable: true,
				type: FieldType.Boolean,
				visible: true,
			},
			{
				id: 'code',
				label: {key: 'cloud.common.entityCode', text: 'Code'},
				model: 'Code',
				readonly: true,
				sortable: true,
				type: FieldType.Code,
				visible: true,
			},
			{
				id: 'description',
				label: {key: 'cloud.common.entityDescription', text: 'Description'},
				model: 'Description',
				readonly: true,
				sortable: true,
				type: FieldType.Description,
				visible: true,
			},
			{
				id: 'status',
				label: {key: 'estimate.main.createMaterialPackageWizard.status', text: 'Status'},
				model: 'Status',
				readonly: true,
				sortable: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedPackageStatusLookupService,
					displayMember: 'DescriptionInfo.Translated',
				}),
				visible: true,
			},
			{
				id: 'configuration',
				label: {key: 'estimate.main.createMaterialPackageWizard.configuration', text: 'Configuration'},
				model: 'Configuration',
				readonly: true,
				sortable: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: PrcSharedPrcConfigLookupService,
					displayMember: 'DescriptionInfo.Translated',
				}),
				visible: true,
			},
			{
				id: 'isMaterial',
				label: {key: 'procurement.package.updateOption.isMaterial', text: 'Is Material'},
				model: 'IsMaterial',
				readonly: true,
				sortable: true,
				type: FieldType.Description,
				visible: true,
			},
			{
				id: 'isService',
				label: {key: 'procurement.package.updateOption.isService', text: 'Is Service'},
				model: 'IsService',
				readonly: true,
				sortable: true,
				type: FieldType.Description,
				visible: true,
			},
		],
	};


	/**
	 * onchange
	 * @param changes
	 */
	public ngOnChanges(changes: SimpleChanges) {
		if (changes['updatePackages']) {
			this.onHideBoqGeneratePackageChanged();
		}
	}

	public onHideBoqGeneratePackageChanged() {
		this.showUpdatePackages = this.isHideBoqGeneratePackage
			? this.updatePackages.filter((item) => {
				return !(!item.IsMaterial && item.IsService);
			})
			: this.updatePackages;
	}
}
