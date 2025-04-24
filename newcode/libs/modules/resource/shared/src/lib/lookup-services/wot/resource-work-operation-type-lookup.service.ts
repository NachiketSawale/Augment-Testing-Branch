/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, LookupContext, UiCommonLookupEndpointDataService, UiCommonLookupInputComponent } from '@libs/ui/common';
import { IResourceWorkOperationTypeEntity } from '@libs/resource/interfaces';
import {Injectable} from '@angular/core';

/**
 * Resource Wot Plant Filter Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class ResourceWorkOperationTypeLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IResourceWorkOperationTypeEntity, TEntity> {
	public constructor() {
		super({
			httpRead: { route: 'resource/wot/workoperationtype/', endPointRead: 'listbycontext' },
			filterParam: 'plantFk',
			prepareListFilter : function (request) {
				const isNil = (val: unknown ) => val === undefined || val === null;
				const requestedId = ((request as LookupContext<IResourceWorkOperationTypeEntity,TEntity>)?.lookupInput as UiCommonLookupInputComponent<IResourceWorkOperationTypeEntity,TEntity, number>)?.value;
				return 'plantFk=' + (!isNil(requestedId) ? requestedId.toString() : '-1');
			},
			dataProcessors : [],
		}, {
			uuid: '589c4b127312498b8f9686be00ac5edd',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						width: 180,
						label: {text: 'Code', key: 'cloud.common.entityCode'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						width: 300,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					},
				]
			},
		});
	}
}