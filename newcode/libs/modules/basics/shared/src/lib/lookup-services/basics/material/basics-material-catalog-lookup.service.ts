/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IMaterialCatalogLookupEntity } from '@libs/basics/interfaces';
import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';

/**
 * Material catalog lookup service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedMaterialCatalogLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IMaterialCatalogLookupEntity, TEntity> {
	/**
	 * The constructor
	 */
	public constructor() {
		super('MaterialCatalog', {
			uuid: '9bb33e32db564580a9a8a00e3f31667b',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: '9bb33e32db564580a9a8a00e3f31667b',
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: {
							text: 'Code',
							key: 'cloud.common.entityCode'
						},
						width: 100,
						visible: true,
						sortable: false,
						readonly: true
					},
					{
						id: 'desc',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {
							text: 'Description',
							key: 'cloud.common.entityDescription'
						},
						width: 150,
						visible: true,
						sortable: false,
						readonly: true
					},
					{
						id: 'bpname',
						model: 'BusinessPartnerName1',
						type: FieldType.Description,
						label: {
							text: 'Business Partner Name1',
							key: 'cloud.common.entityBusinessPartnerName1'
						},
						width: 100,
						visible: true,
						sortable: false,
						readonly: true
					}
				]
			},
			dialogOptions: {
				headerText: {
					text: 'Material Catalog',
					key: 'basics.material.materialCatalog'
				}
			},
			buildSearchString: (searchText: string) => {
				//TODO update it when do framework catalog
				/*if (_.has(this, 'filterOptions.filterIsFramework') && this.filterOptions.filterIsFramework) {
					var isFrameworkCatalogType = basicsLookupdataLookupDescriptorService.getData('isFrameworkCatalogType');
					if (!isFrameworkCatalogType) {
						platformModalService.showErrorBox('procurement.contract.noIsFrameworkMaterialCatalogType', 'cloud.common.errorMessage');
					}
				}*/
				if(!searchText) {
					return '';
				} else {
					const searchString = 'Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%")Or BusinessPartnerName1.Contains("%SEARCH%")';
					return searchString.replace(/%SEARCH%/g, searchText);
				}
			},
			showClearButton: true,
			showDialog: true
		});
	}
}