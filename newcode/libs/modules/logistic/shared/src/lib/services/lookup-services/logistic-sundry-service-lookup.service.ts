/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService} from '@libs/ui/common';
import { ILogisticSundryServiceEntity } from '@libs/logistic/interfaces';
import { Injectable } from '@angular/core';

/**
 * Logistic sundry service group lookup service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticSundryServiceLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ILogisticSundryServiceEntity, TEntity>{

	public constructor() {

		const endpoint = {
			httpRead: { route: 'logistic/sundryservice/', endPointRead: 'listbycontext', usePostForRead: false}
		};
		const config: ILookupConfig<ILogisticSundryServiceEntity, TEntity> =
			{
				uuid: 'cd8335de34ee47d2bbf1de02a87d0a3d',
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
						}
					]
				}
			};

		super(endpoint, config);
	}

}