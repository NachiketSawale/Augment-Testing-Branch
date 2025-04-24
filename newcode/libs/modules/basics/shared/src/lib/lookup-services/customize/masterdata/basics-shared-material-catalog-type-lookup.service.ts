/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMaterialCatalogTypeEntity } from '@libs/basics/interfaces';
import {Observable} from 'rxjs';

/**
 * Lookup Service for IBasicsCustomizeMaterialCatalogTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMaterialCatalogTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMaterialCatalogTypeEntity, T>  {
	private frameworkCatalogTypes: IBasicsCustomizeMaterialCatalogTypeEntity[] | null = null;

	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/materialcatalogtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'cae55d2115c042bc9b1317052827442f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeMaterialCatalogTypeEntity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Issupplier',
						model: 'Issupplier',
						type: FieldType.Boolean,
						label: { text: 'Issupplier' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Location',
						model: 'Location',
						type: FieldType.Quantity,
						label: { text: 'Location' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsFramework',
						model: 'IsFramework',
						type: FieldType.Boolean,
						label: { text: 'IsFramework' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}

	public getDefault(): Observable<IBasicsCustomizeMaterialCatalogTypeEntity> {
		return new Observable(e => {
			this.getList().subscribe(list => {
				list.some(item => {
					if (item.IsDefault === true) {
						e.next(item);
						e.complete();
						return true;
					}
					return false;
				});
			});
		});
	}

	public getFrameworkCatalogTypes() {
		return this.frameworkCatalogTypes;
	}

	public setFrameworkCatlogTypes(types: IBasicsCustomizeMaterialCatalogTypeEntity[] | null) {
		this.frameworkCatalogTypes = types;
	}
}
