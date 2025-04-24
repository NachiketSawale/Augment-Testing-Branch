/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IResourceCatalogRecordEntity } from '@libs/resource/interfaces';


/**
 * Resource Catalog Lookup Service
 */
@Injectable({
	providedIn: 'root'
})

export class ResourceSharedResourceCatalogRecordLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IResourceCatalogRecordEntity, TEntity> {
	public constructor() {
		super({
			httpRead: {route: 'resource/catalog/record/', endPointRead: 'listbyparent', usePostForRead: true},
			filterParam: true,
			prepareListFilter:  (context) => {
				if (context) {
					const tempEntity = context.entity as unknown as { CatalogFk: number | null | undefined };
					if(tempEntity){
						return {
							PKey1: tempEntity.CatalogFk
						};
					}
				}
				return '';
			}
		}, {
			uuid: '7b4441bfbab84282966d379ad3e92b18',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: {text: 'Code', key: 'cloud.common.entityCode'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description',
						model: 'Description',
						type: FieldType.Description,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}