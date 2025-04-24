/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { FieldType, LookupAlertTheme, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IResourceEntity } from '../model/entities/resource-entity.interface';
import { CloudTranslationResourceDataService } from './cloud-translation-resource-data.service';

/**
 * Resource lookup service
 */
@Injectable({
	providedIn: 'root',
})
export class CloudTranslationResourceLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IResourceEntity, TEntity> {
	private readonly dataservice = inject(CloudTranslationResourceDataService);
	public constructor() {
		super(
			{
				httpRead: {
					route: 'cloud/translation/resource/bykey',
					endPointRead: '',
					usePostForRead: false,
				},
				filterParam: true,
				prepareListFilter: () => {
					return 'id=' + this.dataservice.getSelection()[0].ResourceFk;
				},
			},
			{
				uuid: '4d35ae8687dd4ed6aa5ce4b47befad0b',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'ResourceTerm',
				gridConfig: {
					uuid: '4d35ae8687dd4ed6aa5ce4b47befad0b',
					columns: [
						{ id: 'ResourceTerm', model: 'ResourceTerm', type: FieldType.Description, label: { text: 'Resource Term ' }, sortable: true, visible: true, readonly: true },
						{ id: 'ResourceKey', model: 'ResourceKey', type: FieldType.Description, label: { text: 'Resource Key' }, sortable: true, visible: true, readonly: true },
						{ id: 'Path', model: 'Path', type: FieldType.Description, label: { text: 'Path' }, sortable: true, visible: true, readonly: true },
						{ id: 'IsApproved', model: 'IsApproved', type: FieldType.Description, label: { text: 'IsApproved' }, sortable: true, visible: true, readonly: true },
					],
				},
				dialogOptions: {
					headerText: 'Assign a Resoruce',
					alerts: [{ theme: LookupAlertTheme.Warning, message: 'test warning' }],
				},
				showDialog: true,
			},
		);

		this.paging.enabled = true;
		this.paging.pageCount = 20;
	}
}
