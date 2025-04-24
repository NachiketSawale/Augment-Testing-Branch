/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService} from '@libs/ui/common';
import { ILogisticSundryServiceGroupEntity } from '@libs/logistic/interfaces';
import { Injectable } from '@angular/core';

/**
 * Logistic sundry service group lookup service
 */
@Injectable({
	providedIn: 'root'
})
export class LogisticSundryServiceGroupLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ILogisticSundryServiceGroupEntity, TEntity>{

	public constructor() {

		const endpoint = {
			httpRead: { route: 'logistic/sundrygroup/', endPointRead: 'searchlist', usePostForRead: true}
		};
		const config: ILookupConfig<ILogisticSundryServiceGroupEntity, TEntity> =
			{
				uuid: '7425ffe5fee34c25b411e798cafa6107',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig:{
					columns: [
						{
							id: 'Code',
							model: 'Code',
							type: FieldType.Code,
							label: {key: 'cloud.common.entityCode'},
							sortable: false,
							visible: true,
							readonly: true,
							width: 300
						},
						{
							id: 'Description',
							model: 'DescriptionInfo',
							type: FieldType.Description,
							label: {key: 'cloud.common.entityDescription'},
							sortable: false,
							visible: true,
							readonly: true,
							width: 250
						},
					]
				},
				treeConfig: {
					parentMember: 'SundryServiceGroupFk',
					childMember: 'SundryServiceGroups',
				}
			};

		super(endpoint, config);
	}

}