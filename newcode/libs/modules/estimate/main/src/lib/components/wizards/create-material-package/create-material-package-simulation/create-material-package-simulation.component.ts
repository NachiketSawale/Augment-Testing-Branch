/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, Input } from '@angular/core';
import { ConcreteFieldOverload, createLookup, FieldType, FieldValidationInfo, getMultiStepDialogDataToken, IFormConfig, IFormValueChangeInfo, IGridConfiguration } from '@libs/ui/common';
import {
	ICreateMatPkgDataComplete,
	ICreateMatPkgNewPackageOption,
	ICreateMatPkgSimulationItem, ICreateMatPkgSimulationOptionItem,

} from '../../../../model/interfaces/estimate-main-create-material-package.interface';
import {
	BasicsSharedClerkLookupService, BasicsSharedNumberGenerationService,
	BasicsSharedPackageStatusLookupService,
	BasicsSharedProcurementConfigurationLookupService,
	BasicsSharedProcurementStructureLookupService, BasicsSharedStatusIconService, IUniqueFieldOption
} from '@libs/basics/shared';
import { ProcurementPackageLookupService } from '@libs/procurement/shared';
import { EstimateMainCreateMaterialPackageSelectionOption } from '../../../../model/enums/estimate-main-create-material-package.enum';
import { IBasicsCustomizePackageStatusEntity } from '@libs/basics/interfaces';
import { ValidationResult } from '@libs/platform/data-access';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { EstimateMainCreateMaterialPackageWizardService } from '../../../../wizards/estimate-main-create-material-package-wizard.service';

@Component({
	selector: 'estimate-main-create-material-package-simulation',
	templateUrl: './create-material-package-simulation.component.html',
	styleUrl: './create-material-package-simulation.component.scss'
})

export class CreateMatPkgSimulationComponent {
	protected readonly FieldType = FieldType;
	private numberGenerationService = inject(BasicsSharedNumberGenerationService);
	private basicsSharedProcurementStructureLookupService = inject(BasicsSharedProcurementStructureLookupService);
	private isCodeReadOnly: boolean = false;
	private readonly dialogData = inject(getMultiStepDialogDataToken<ICreateMatPkgDataComplete>());
	private readonly defaultValueOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<ICreateMatPkgSimulationItem>>({
		type: FieldType.Description
	});
	@Input()
	public optionItem!: ICreateMatPkgSimulationOptionItem;
	@Input()
	public newPackageOption!: ICreateMatPkgNewPackageOption;

	public uniqueFieldOption: IUniqueFieldOption = {
		identityName: 'generate.packageitem.from.lineitem',
		dynamicUniqueFieldService: inject(EstimateMainCreateMaterialPackageWizardService)
	};


	public simulationConfiguration: IGridConfiguration<ICreateMatPkgSimulationItem> = {
		uuid: '17060CA12C09451FA5D20AF9608083A8',
		columns: [
			{
				id: 'selected',
				label: {key: 'estimate.main.createMaterialPackageWizard.new', text: 'New'},
				model: 'Selected',
				readonly: false,
				sortable: true,
				type: FieldType.Boolean,
				width: 35,
				visible: true,
				validator: info => this.selectedValueChange(info)
			},
			{
				id: 'merge',
				label: {key: 'estimate.main.createMaterialPackageWizard.mergeUpdate', text: 'Merge Update'},
				model: 'Merge',
				readonly: false,
				sortable: true,
				type: FieldType.Boolean,
				width: 70,
				visible: true
			},
			{
				id: 'matchness',
				label: {key: 'estimate.main.createMaterialPackageWizard.matchness', text: 'Matchness'},
				model: 'Matchness',
				width: 90,
				readonly: false,
				sortable: true,
				type: FieldType.Description,
				visible: true
			},
			{
				id: 'structureCode',
				label: {key: 'estimate.main.createMaterialPackageWizard.structureCode', text: 'Structure Code'},
				model: 'Code',
				readonly: true,
				sortable: true,
				type: FieldType.Code,
				visible: true,
			},
			{
				id: 'structureDescription',
				label: {key: 'estimate.main.createMaterialPackageWizard.structureDescription', text: 'Structure Description'},
				model: 'Description',
				readonly: true,
				sortable: true,
				type: FieldType.Description,
				visible: true,
			},
			{
				id: 'status',
				label: {key: 'estimate.main.createMaterialPackageWizard.status', text: 'Status'},
				model: 'PackageStatusFk',
				readonly: true,
				sortable: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedPackageStatusLookupService,
					imageSelector: inject(BasicsSharedStatusIconService<IBasicsCustomizePackageStatusEntity, ICreateMatPkgSimulationItem>),
					displayMember: 'DescriptionInfo.Translated',
				}),
				visible: true,
			},
			{
				id: 'packageCode',
				label: {key: 'estimate.main.createMaterialPackageWizard.packageCode', text: 'Package Code'},
				sortable: true,
				model: 'PackageCodeFk',
				readonly: false,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementPackageLookupService,
					displayMember: 'Code',
				}),
				visible: true,
			}, {
				id: 'packageDescription',
				label: {key: 'estimate.main.createMaterialPackageWizard.packageDescription', text: 'Package Description'},
				sortable: true,
				model: 'PackageDescriptionFk',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementPackageLookupService,
					displayMember: 'Description',
				}),
				visible: true,
			}, {
				id: 'subPackage',
				label: {key: 'estimate.main.createMaterialPackageWizard.subPackage', text: 'Sub Package'},
				sortable: true,
				model: 'SubPackageFk',
				type: FieldType.Dynamic,
				overload: ctx => {
					this.updateDefaultValueOverload(ctx.entity);
					return this.defaultValueOverloadSubject;
				}
			}, {
				id: 'configuration',
				label: {key: 'estimate.main.createMaterialPackageWizard.configuration', text: 'Configuration'},
				sortable: true,
				model: 'ConfigurationFk',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
					displayMember: 'DescriptionInfo.Translated',
				}),
				visible: true,
			}, {
				id: 'responsible',
				label: {key: 'estimate.main.createMaterialPackageWizard.responsible', text: 'Responsible'},
				sortable: true,
				model: 'ClerkPrcFk',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkLookupService,
					displayMember: 'Code',
				}),
				visible: true,
			},
		],
	};

	public formConfiguration: IFormConfig<ICreateMatPkgNewPackageOption> = {
		formId: 'procurement.package.create.package',
		showGrouping: false,
		groups: [
			{
				groupId: 'basicData',
				header: {key: 'estimate.main.createMaterialPackageWizard.newPackageDefinition'},
				open: true,
				visible: true,
				sortOrder: 1,
			},
		],
		rows: [
			{
				id: 'procurementStructureId',
				groupId: 'basicData',
				label: {
					text: 'Procurement Structure',
					key: 'estimate.main.createMaterialPackageWizard.procurementStr',
				},
				type: FieldType.Lookup,
				model: 'procurementStructureId',
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProcurementStructureLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Translated',
					events: [{
						name: 'onSelectedItemChanged',
						handler: e => {
							if (e.context.lookupInput?.selectedItem?.DescriptionInfo) {
								this.updatePackageOptionByStructureId(e.context.lookupInput.selectedItem.Id);
							}
						}
					}]
				}),
			},
			{
				id: 'configurationId',
				groupId: 'basicData',
				label: {
					text: 'Configuration',
					key: 'estimate.main.createMaterialPackageWizard.configuration',
				},
				type: FieldType.Lookup,
				model: 'configurationId',
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
					events: [{
						name: 'onSelectedItemChanged',
						handler: e => {
							if (e.context.lookupInput?.selectedItem) {
								this.changeConfiguration(e.context.lookupInput.selectedItem.RubricCategoryFk);
							}
						}
					}]
				}),
			},
			{
				id: 'package',
				groupId: 'basicData',
				label: {
					text: 'Code',
					key: 'estimate.main.createMaterialPackageWizard.procurementPackage',
				},
				type: FieldType.Composite,
				visible: true,
				composite: [{id: 'code', model: 'code', type: FieldType.Code, readonly: this.isCodeReadOnly},
					{id: 'packageDescription', model: 'packageDescription', type: FieldType.Description}]
			},
			{
				id: 'subPackage',
				groupId: 'basicData',
				label: {
					text: 'Sub Package',
					key: 'estimate.main.createMaterialPackageWizard.subPackage',
				},
				type: FieldType.Description,
				visible: true,
				model: 'subpackageDescription',
			},
			{
				id: 'reference',
				groupId: 'basicData',
				label: {
					text: 'Reference',
					key: 'estimate.main.createMaterialPackageWizard.reference',
				},
				type: FieldType.Description,
				visible: true,
				model: 'reference',
			},
			{
				id: 'responsible',
				groupId: 'basicData',
				label: {
					text: 'Responsible',
					key: 'estimate.main.createMaterialPackageWizard.responsible',
				},
				type: FieldType.Lookup,
				model: 'responsibleId',
				lookupOptions: createLookup({
					showDescription: true,
					dataServiceToken: BasicsSharedClerkLookupService,
					descriptionMember: 'ClerkPrcDescription',
					disableInput: false,
					showClearButton: true,
					showEditButton: true,
				})
			}
		]
	};

	public updateDefaultValueOverload(entity?: ICreateMatPkgSimulationItem) {
		let value: ConcreteFieldOverload<ICreateMatPkgSimulationItem> = {
			type: FieldType.Description
		};
		if (entity?.PackageDescriptionFk) {
			value = {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementPackageLookupService,
					displayMember: 'Description',
					showClearButton: true
				})
			};
		}
		this.defaultValueOverloadSubject.next(value);
	}

	private async updatePackageOptionByStructureId(structureId: number) {
		const structure = await firstValueFrom(this.basicsSharedProcurementStructureLookupService.getItemByKey({id: structureId}));
		if (structure) {
			this.newPackageOption.packageDescription = structure.DescriptionInfo.Description;
			this.newPackageOption.subpackageDescription = structure.DescriptionInfo.Description;
		}
	}


	private selectedValueChange(info: FieldValidationInfo<ICreateMatPkgSimulationItem>) {
		//todo checkbox in grid change event seem no support by framework
		return new ValidationResult();
	}

	private changeConfiguration(rubricCategoryId: number) {
		this.isCodeReadOnly = this.numberGenerationService.hasNumberGenerateConfig(rubricCategoryId);
		this.newPackageOption.code = this.numberGenerationService.provideNumberDefaultText(rubricCategoryId);
	}

	public get hasNewItem() {
		if (this.optionItem.simulationItems.length > 0) {
			return !!this.optionItem.simulationItems.find(item => item.Selected);
		}
		return false;
	}

	public get disableMaterialCatalog() {
		const selectItem = this.dialogData.dataItem.selectionOptions.optionItem.selectedItem;
		return !(this.hasNewItem && selectItem === EstimateMainCreateMaterialPackageSelectionOption.ProcurementStructure || selectItem === EstimateMainCreateMaterialPackageSelectionOption.MaterialAndCostCode);
	}

	public onOnePackageChange() {
		if (this.optionItem.isOnePackage) {
			this.optionItem.isSeparateMaterialCatalog = false;
		}
	}

	public onSeparateMaterialCatalogChange() {
		if (this.optionItem.isSeparateMaterialCatalog) {
			this.optionItem.isOnePackage = false;
		}
	}

	public valueChanged(changeInfo: IFormValueChangeInfo<ICreateMatPkgNewPackageOption>): void {
		this.newPackageOption.subpackageDescription = changeInfo.newValue as string;
	}
}