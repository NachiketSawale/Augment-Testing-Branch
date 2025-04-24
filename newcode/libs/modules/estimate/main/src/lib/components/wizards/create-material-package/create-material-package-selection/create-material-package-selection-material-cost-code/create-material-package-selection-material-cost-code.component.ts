/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICreateMatPkgMatAndCCSelectionItem, ICreateMatPkgSelectionOptionItem } from '../../../../../model/interfaces/estimate-main-create-material-package.interface';
import { createLookup, FieldType, IGridConfiguration } from '@libs/ui/common';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { EstimateMainCreateMaterialPackageItemType } from '../../../../../model/enums/estimate-main-create-material-package.enum';


@Component({
	selector: 'estimate-main-create-material-package-selection-material-cost-code',
	templateUrl: './create-material-package-selection-material-cost-code.component.html',
	styleUrl: './create-material-package-selection-material-cost-code.component.scss',
})
export class CreateMatPkgSelectionMatAndCCComponent implements OnChanges {
	protected readonly FieldType = FieldType;
	@Input()
	public optionItem!: ICreateMatPkgSelectionOptionItem;
	@Input()
	public items!: ICreateMatPkgMatAndCCSelectionItem[];

	public selectItemConfig: IGridConfiguration<ICreateMatPkgMatAndCCSelectionItem> = {
		uuid: '19EE5456F085450F8A5BAE37A43E1B64',
		idProperty: 'Idx',
		columns: [
			{
				id: 'selected',
				label: {key: 'cloud.common.entitySelected', text: 'Selected'},
				model: 'Selected',
				readonly: false,
				sortable: true,
				type: FieldType.Boolean,
				visible: true
			}, {
				id: 'code',
				label: {key: 'cloud.common.entityCode', text: 'Code'},
				model: 'Code',
				readonly: true,
				sortable: true,
				type: FieldType.Code,
				visible: true,
			}, {
				id: 'description',
				label: {key: 'cloud.common.entityDescription', text: 'Description'},
				model: 'Description',
				readonly: true,
				sortable: true,
				type: FieldType.Description,
				visible: true,
			}, {
				id: 'type',
				label: {key: 'cloud.common.entityType', text: 'Type'},
				model: 'Type',
				readonly: true,
				sortable: true,
				type: FieldType.Description,
				visible: true,
				//todo formater type to icon+description
				/*
				formatter: function (row, cell, value) {
							let imgSrc = value >= 1 ? 'ico-ccode02' : 'ico-resource18';
							let imgPath = '<img src="cloud.style/content/images/type-icons.svg#' + imgSrc + '"/>';
							let txt = value >= 1 ? $translate.instant('estimate.main.createMaterialPackageWizard.costCode') : $translate.instant('estimate.main.createMaterialPackageWizard.material');
							return imgPath + '<span class="pane-r">' + txt + '</span>';
				}
				*/
			}, {
				id: 'description2',
				label: {key: 'estimate.main.createMaterialPackageWizard.entityFurtherDescription', text: 'Description2'},
				model: 'Description',
				readonly: true,
				sortable: true,
				type: FieldType.Description,
				visible: true,
			}, {
				id: 'mdcGroupCode',
				label: {key: 'estimate.main.createMaterialPackageWizard.materialGroupCode', text: 'Material Group Code'},
				model: 'MaterialGroupCode',
				readonly: true,
				sortable: true,
				type: FieldType.Code,
				visible: true,
			}, {
				id: 'mdcGroupDescription',
				label: {key: 'estimate.main.createMaterialPackageWizard.materialGroupDescription', text: 'Material Group Description'},
				model: 'MaterialGroupDescription',
				readonly: true,
				sortable: true,
				type: FieldType.Description,
				visible: true,
			}, {
				id: 'structureCode',
				label: {key: 'estimate.main.createMaterialPackageWizard.structureCode', text: 'Structure Code'},
				model: 'StructureCode',
				readonly: true,
				sortable: true,
				type: FieldType.Code,
				visible: true,
			}, {
				id: 'structureDescription',
				label: {key: 'estimate.main.createMaterialPackageWizard.structureDescription', text: 'Structure Description'},
				model: 'StructureDescription',
				readonly: true,
				sortable: true,
				type: FieldType.Description,
				visible: true,
			}, {
				id: 'businessPartner',
				label: {key: 'estimate.main.createMaterialPackageWizard.businessPartner', text: 'Business Partner'},
				model: 'BusinessPartnerFk',
				readonly: true,
				sortable: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerLookupService
				}),
				visible: true,
			}, {
				id: 'indirectCost',
				label: {key: 'estimate.main.isIndirectCost', text: 'Indirect Cost'},
				model: 'InDirectCost',
				readonly: true,
				sortable: true,
				type: FieldType.Boolean,
				visible: true,
			}, {
				id: 'isCost',
				label: {key: 'estimate.main.isCost', text: 'Is Cost'},
				model: 'IsCost',
				readonly: true,
				sortable: true,
				type: FieldType.Boolean,
				visible: true,
			}
		],
	};

	/**
	 * onchange
	 * @param changes
	 */
	public ngOnChanges(changes: SimpleChanges) {
		if (changes['items']) {
			if (this.items.length > 0) {
				this.filterByOption();
			}
		}
	}

	public filterByOption() {
		const showItems: ICreateMatPkgMatAndCCSelectionItem[] = [];
		const itemMap: Map<number, ICreateMatPkgMatAndCCSelectionItem> = new Map();
		this.items.forEach(item => {
			const id = item.Id;
			if (this.optionItem.isIncludeMaterial && item.Type === EstimateMainCreateMaterialPackageItemType.Material && !itemMap.has(id)) {
				showItems.push(item);
				itemMap.set(id, item);
			}
			if (item.Type === EstimateMainCreateMaterialPackageItemType.MdcCostCode || item.Type === EstimateMainCreateMaterialPackageItemType.PrjCostCode) {
				if (!item.IsCost && this.optionItem.isIncludeMarkUpCost && !itemMap.has(id)) {
					showItems.push(item);
					itemMap.set(id, item);
				}
				if (item.IsCost && this.optionItem.isIncludeDirectCost && !item.InDirectCost && !itemMap.has(id)) {
					showItems.push(item);
					itemMap.set(id, item);
				}
				if (item.IsCost && this.optionItem.isIncludeDirectCost && item.InDirectCost && !itemMap.has(id)) {
					showItems.push(item);
					itemMap.set(id, item);
				}
			}
		});
		this.optionItem.showMaterialAndCostCodeItems = showItems;
	}
}
