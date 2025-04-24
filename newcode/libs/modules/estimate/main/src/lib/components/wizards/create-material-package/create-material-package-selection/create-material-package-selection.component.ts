/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { createLookup, FieldType, FieldValidationInfo, IGridConfiguration } from '@libs/ui/common';
import { ICreateMatPkgSelectionOptionItem, ICreateMatPkgSelectionItem, ICreateMatPkgStructureSelectionItem, ICreateMatPkgCostCodeSelectionItem, ICreateMatPkgCatAndGrpSelectionItem,
} from '../../../../model/interfaces/estimate-main-create-material-package.interface';
import { EstimateMainCreateMaterialPackageModeOption, EstimateMainCreateMaterialPackageSelectionOption } from '../../../../model/enums/estimate-main-create-material-package.enum';
import { BasicsSharedCostCodeTypeLookupService, BasicsSharedProcurementStructureTypeLookupService } from '@libs/basics/shared';
import { ValidationResult } from '@libs/platform/data-access';
import { cloneDeep } from 'lodash';

@Component({
	selector: 'estimate-main-create-material-package-selection',
	templateUrl: './create-material-package-selection.component.html',
	styleUrl: './create-material-package-selection.component.scss'
})
export class CreateMatPkgSelectionComponent implements OnChanges {
	protected readonly EstimateMainCreateMaterialPackageSelectionOption = EstimateMainCreateMaterialPackageSelectionOption;
	protected readonly FieldType = FieldType;
	protected readonly EstimateMainCreateMaterialPackageModeOption = EstimateMainCreateMaterialPackageModeOption;
	public structureItems: ICreateMatPkgStructureSelectionItem[] = [];
	public catalogAndGroupItems: ICreateMatPkgCatAndGrpSelectionItem[] = [];
	@Input()
	public optionItem!: ICreateMatPkgSelectionOptionItem;
	@Input()
	public selectionItems!: ICreateMatPkgSelectionItem[];


	protected readonly modeOptions = {
		itemsSource: {
			items: [
				{
					id: EstimateMainCreateMaterialPackageModeOption.inclusiveMode,
					displayName: {key: 'estimate.main.createMaterialPackageWizard.inclusiveMode'},
				},
				{
					id: EstimateMainCreateMaterialPackageModeOption.distinctMode,
					displayName: {key: 'estimate.main.createMaterialPackageWizard.distinctMode'},
				}
			],
		},
	};

	public onModeChange() {
		if (this.optionItem.modeOption === EstimateMainCreateMaterialPackageModeOption.distinctMode) {
			this.optionItem.isRootLevelDisable = true;
		}
		this.setChildItemToReadOnly();
	}

	//todo control grid readOnly need framework support
	public setChildItemToReadOnly() {

	}

	//structure grid config
	public structureGridConfig: IGridConfiguration<ICreateMatPkgStructureSelectionItem> = {
		uuid: 'AA6AC85D1D3F4BAD86CF56B7CE1A2E9D',
		columns: [
			{
				id: 'selected',
				label: {key: 'cloud.common.entitySelected', text: 'Selected'},
				model: 'Selected',
				readonly: false,
				sortable: true,
				type: FieldType.Boolean,
				visible: true,
				//validator: info => this.checkedValueChange(info)
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
				id: 'type',
				label: {key: 'cloud.common.entityType', text: 'Type'},
				model: 'TypeFk',
				readonly: true,
				sortable: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProcurementStructureTypeLookupService,
					displayMember: 'DescriptionInfo.Translated',
				}),
				visible: true,
			},
		],
		idProperty: 'Id',
		skipPermissionCheck: true,
		treeConfiguration: {
			parent: entity => {
				if (entity.ParentFk) {
					return this.structureGridConfig?.items?.find(item => item.Id === entity.ParentFk) || null;
				}
				return null;
			},
			children: entity => {
				return entity.resultChildren;
			}
		}
	};

	//cost code grid config
	public readonly costCodeGridConfig: IGridConfiguration<ICreateMatPkgCostCodeSelectionItem> = {
		uuid: '19EE5456F085450F8A5BAE37A43E1B64',
		columns: [
			{
				id: 'selected',
				label: {key: 'cloud.common.entitySelected', text: 'Selected'},
				model: 'Selected',
				readonly: false,
				sortable: true,
				type: FieldType.Boolean,
				visible: true,
				//validator: info => this.checkedValueChange(info)
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
				id: 'type',
				label: {key: 'cloud.common.entityType', text: 'Type'},
				model: 'CostCodeTypeFk',
				readonly: true,
				sortable: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedCostCodeTypeLookupService,
					displayMember: 'DescriptionInfo.Translated',
				}),
				visible: true,
			},
		],
		idProperty: 'Idx',
		skipPermissionCheck: true,
		treeConfiguration: {
			parent: entity => {
				if (entity.ParentFk) {
					return this.costCodeGridConfig?.items?.find(item => item.Id === entity.ParentFk && item.TypeFk === entity.TypeFk) || null;
				}
				return null;
			},
			children: entity => {
				return entity.resultChildren ? entity.resultChildren as ICreateMatPkgCostCodeSelectionItem[]: [];
			}
		}
	};

	//materialCatalog grid config
	public readonly materialCatalogGridConfig: IGridConfiguration<ICreateMatPkgCatAndGrpSelectionItem> = {
		uuid: '19EE5456F085450F8A5BAE37A43E1B64',
		columns: [
			{
				id: 'selected',
				label: {key: 'cloud.common.entitySelected', text: 'Selected'},
				model: 'Selected',
				readonly: false,
				sortable: true,
				type: FieldType.Boolean,
				visible: true
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
			}
		],
		idProperty: 'Idx',
		skipPermissionCheck: true,
		treeConfiguration: {
			parent: entity => {
				if (entity.ParentFk) {
					return this.materialCatalogGridConfig?.items?.find(item => item.Id === entity.ParentFk && item.TypeFk === entity.TypeFk) || null;
				} else {
					return this.materialCatalogGridConfig?.items?.find(item => item.Id === entity.MaterialCatalogFk && item.TypeFk !== entity.TypeFk) || null;
				}
			},
			children: entity => {
				return entity.resultChildren ? entity.resultChildren as ICreateMatPkgCatAndGrpSelectionItem[] : [];
			}
		}
	};


	public includeMarkUpCostChange() {
		const items = cloneDeep(this.selectionItems) as ICreateMatPkgCostCodeSelectionItem[];
		if (!this.optionItem.isIncludeMarkUpCost) {
			this.optionItem.showCostCodeItems = this.filterMarkUpCostItem(items);
		} else {
			this.optionItem.showCostCodeItems = items;
		}
	}

	private filterMarkUpCostItem(items: ICreateMatPkgCostCodeSelectionItem[]) {
		const showItems = items.filter(item => item.IsCost);
		showItems.forEach(item => {
			if (item.resultChildren) {
				item.resultChildren = this.filterMarkUpCostItem(item.resultChildren as ICreateMatPkgCostCodeSelectionItem[]);
			}
		});
		return showItems;
	}


	//todo when support checkbox select event ,here function need check again
	public checkedValueChange(info: FieldValidationInfo<ICreateMatPkgStructureSelectionItem>) {
		const selectedValue = info.value as boolean;
		if (this.optionItem.modeOption === EstimateMainCreateMaterialPackageModeOption.inclusiveMode && selectedValue) {
			this.optionItem.isRootLevelDisable = false;
		}
		return new ValidationResult();
	}


	public ngOnChanges(changes: SimpleChanges) {
		if (changes['selectionItems']) {
			if (this.selectionItems.length > 0) {
				if (this.optionItem.selectedItem === EstimateMainCreateMaterialPackageSelectionOption.ProcurementStructure) {
					this.structureItems = this.selectionItems as ICreateMatPkgStructureSelectionItem[];
				} else if (this.optionItem.selectedItem === EstimateMainCreateMaterialPackageSelectionOption.CostCode) {
					this.includeMarkUpCostChange();
				} else if (this.optionItem.selectedItem === EstimateMainCreateMaterialPackageSelectionOption.MaterialCatalogAndGroup) {
					this.catalogAndGroupItems = this.selectionItems as ICreateMatPkgCatAndGrpSelectionItem[];
				}
			}
		}
	}

}
