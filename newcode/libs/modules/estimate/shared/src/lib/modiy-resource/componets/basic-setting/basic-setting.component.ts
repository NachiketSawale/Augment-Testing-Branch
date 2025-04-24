/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ComponentFactoryResolver, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { Orientation, PlatformTranslateService } from '@libs/platform/common';
import { ISplitGridSplitter } from '@libs/ui/business-base';
import { IEstModifyFieldsEntity } from '@libs/estimate/interfaces';
import { FieldType, getCustomDialogDataToken, GridComponent, IGridConfiguration, UiCommonLookupInputComponent, UiCommonLookupReadonlyDataService } from '@libs/ui/common';
import { IEstimateResourceFieldValue } from '../../model/estimte-modify-resource-field-value.interface';
import { forEach } from 'lodash';
import { EstimateModifyResourceDataService } from '../../services/estimate-modify-resource-data.service';
import { EstimateShareCostCodesLookupService } from '../../../lookups/estimate-share-cost-codes-lookup.service';
import { EstimateMainAssemblyTemplateLookupService } from '../../../lookups/assembly-template/estimate-main-assembly-template-lookup.service';
import { IModifyResourceEntity } from '../../model/estimate-modify-resource-entity.interface';
import { ModifyResourceDialogComponent } from '../modify-resource-dailog/modify-resource-dialog.component';
import { ModifyResourceModuleEnum } from '../../enum/estimate-modify-resource-module.enum';
import { EstimateMainResourceType } from '../../../common/enums/estimate-main-resource-type.enum';
import { ValidationResult } from '@libs/platform/data-access';

@Component({
	templateUrl: './basic-setting.component.html',
	styleUrls: ['./basic-setting.component.scss'],
})
export class ModifyResourceBasicSettingComponent implements AfterViewInit {

	private readonly translateService = inject(PlatformTranslateService);
	private readonly dataService = inject(EstimateModifyResourceDataService);
	protected readonly costCodeLookup = inject(EstimateShareCostCodesLookupService);
	protected readonly assemblyLookup = inject(EstimateMainAssemblyTemplateLookupService);

	private readonly dialogWrapper = inject(getCustomDialogDataToken<IModifyResourceEntity, ModifyResourceDialogComponent>());
	private entity?: IModifyResourceEntity | null = this.dialogWrapper.value;
	protected isOpenFromAssembly: boolean = this.entity?.ModifyOptions.ModuleType === ModifyResourceModuleEnum.Assembly;

	public constructor(private componentFactoryResolver: ComponentFactoryResolver) {

	}

	@ViewChild('parentGridHost')
	protected parentGridHost: GridComponent<IEstModifyFieldsEntity> | undefined;

	@ViewChild('childGridHost')
	protected childGridHost: GridComponent<IEstimateResourceFieldValue> | undefined;

	@ViewChild('lookupComponent', { read: ViewContainerRef })
	protected lookupContainer: ViewContainerRef | undefined;

	public ngAfterViewInit(): void {
		// load resource fields
		this.dataService.getResourceFields().subscribe(res=>{
			const items = res as IEstModifyFieldsEntity[];
			forEach(items, (item) => {
				item.Checked = false;
			});
			if(res){
				this.parentGridConfig = {
					...this.parentGridConfig,
					items: [...items]
				};
			}

			this.parentGridHost?.columnSearch();
			this.childGridHost?.columnSearch();
			this.parentGridHost?.columnSearch();
			this.childGridHost?.columnSearch();
		});

		this.dataService.clearFieldValues();

		this.lookupType = this.entity?.ModifyOptions.SelectedResource?.EstResourceTypeFk === EstimateMainResourceType.Material? '12'
			: this.entity?.ModifyOptions.SelectedResource?.EstResourceTypeFk === EstimateMainResourceType.Assembly? '13'
				: '11';
		this.resourceTypeChange(this.lookupType);

	}

	protected splitter: ISplitGridSplitter = {
		direction: Orientation.Horizontal,
		areaSizes: [50, 50]
	};

	protected parentGridConfig: IGridConfiguration<IEstModifyFieldsEntity> = {
		uuid: '41a655fe9ff5439f8254a6fb8ec62339',
		columns: [
			{
				id: 'f1',
				label: {
					text: 'Description',
					key: 'estimate.main.modifyResourceWizard.fields.description'
				},
				type: FieldType.Description,
				model: 'Description',
				sortOrder: 1,
				width: 200,
				readonly: true,
				visible: true,
				sortable: false
			},
			{
				id: 'f2',
				label: {
					text: 'Filter',
					key: 'estimate.main.modifyResourceWizard.fields.isFilter'
				},
				type: FieldType.Boolean,
				headerChkbox: true,
				model: 'Checked',
				sortOrder: 1,
				width: 90,
				visible: true,
				sortable: false,
				validator: info => {
					info.entity.Checked = info.value as boolean;
					this.onParentChanged([info.entity]);
					return new ValidationResult();
				}
			}
		],
		items: [],
		skipPermissionCheck: true
	};

	protected childConfig: IGridConfiguration<IEstimateResourceFieldValue> = {
		uuid: '41a655fe9ff5439f8254a6fb8ec62400',
		columns: [
			{
				id: 'f11',
				label: {
					text: 'Description',
					key: 'estimate.main.modifyResourceWizard.fieldsvalue.description'
				},
				type: FieldType.Description,
				model: 'displayValue',
				sortOrder: 1,
				width: 200,
				readonly: true,
				visible: true,
				sortable: false
			},
			{
				id: 'f21',
				label: {
					text: 'Filter',
					key: 'estimate.main.modifyResourceWizard.fieldsvalue.isFilter'
				},
				type: FieldType.Boolean,
				headerChkbox: true,
				model: 'checked',
				sortOrder: 1,
				width: 90,
				visible: true,
				sortable: false
			}
		],
		items: [],
		skipPermissionCheck: true
	};

	protected label1: string = this.translateService.instant('estimate.main.modifyResourceWizard.specifyResource').text;
	protected label2: string = this.translateService.instant('estimate.main.modifyResourceWizard.ignorejob').text;
	protected label3: string = this.translateService.instant('estimate.main.modifyResourceWizard.specifyResourceJob').text;

	protected ignoreResJob: boolean = false;

	protected onParentChanged(selecteds: IEstModifyFieldsEntity[]) {
		if(selecteds.length > 0){
			const selected = selecteds[0];
			this.dataService.getFiledValues(selected).then(values => {
				this.childConfig = {
					...this.childConfig,
					items: [...(values as IEstimateResourceFieldValue[])]
				};
			});
		}
	}

	protected lookupType: string = '11';
	protected items = [
		{id: 11, displayName: this.translateService.instant('estimate.main.mdcCostCodeFk').text, isSelected: false},
		{id: 12, displayName: this.translateService.instant('estimate.main.mdcMaterialFk').text, isSelected: false},
		{id: 13, displayName: this.translateService.instant('estimate.main.assembly').text, isSelected: false},
		// {id: 15, displayName: this.translateService.instant('estimate.main.equipmentAssembly').text},
	];

	protected resourceTypeChange(value: string) {
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UiCommonLookupInputComponent);
		this.lookupContainer?.clear();
		const viewRef = this.lookupContainer?.createComponent(componentFactory);
		const instance = viewRef!.instance as UiCommonLookupInputComponent<object, object, number|null|undefined>;
		instance.value = this.entity?.ModifyOptions.SelectedResource?.EstResourceTypeFk === EstimateMainResourceType.CostCode ? this.entity?.ModifyOptions.SelectedResource?.ProjectCostCodeFk
			: this.entity?.ModifyOptions.SelectedResource?.EstResourceTypeFk === EstimateMainResourceType.Material? this.entity?.ModifyOptions.SelectedResource?.MdcMaterialFk
				: this.entity?.ModifyOptions.SelectedResource?.EstResourceTypeFk === EstimateMainResourceType.Assembly? this.entity?.ModifyOptions.SelectedResource?.EstAssemblyFk
					: null;
		switch (value){
			case '11':
				instance.dataService = this.costCodeLookup as UiCommonLookupReadonlyDataService<object, object>;
				instance.options = {
					showDescription: true,
					descriptionMember:'Description',
					showClearButton: true
				};
				break;
			case '12':
				//TODO:  need to change to project material lookup
				instance.dataService = this.costCodeLookup as UiCommonLookupReadonlyDataService<object, object>;
				instance.options = {
					showDescription: false,
					descriptionMember:'Description',
					showClearButton: true
				};
				break;
			case '13':
				instance.dataService = this.assemblyLookup as UiCommonLookupReadonlyDataService<object, object>;
				instance.options = {
					showDescription: true,
					descriptionMember:'DescriptionInfo.Translated',
					showClearButton: true
				};
				break;
		}
	}
}