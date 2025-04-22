/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Rubric } from '@libs/basics/shared';
import { WipPrcConfigurationModel } from '../model/wip-prc-configuration.model';

@Injectable({
	providedIn: 'root'
})
export class SalesWipCreateBillConfigurationLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<WipPrcConfigurationModel, TEntity> {
	public constructor() {
		const endpoint =
			{
				httpRead:
					{
						route: 'basics/lookupdata/master/getsearchlist',
						endPointRead: '?lookup=prcconfiguration&filtervalue=(RubricFk%3D'+Rubric.Bill+'%20)',
						usePostForRead: false
					}
			};

		const gridConfig: ILookupConfig<WipPrcConfigurationModel, TEntity> = {
			uuid: 'b71e6d4dbed84341886e3ee4e9315ee0',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Description',
			gridConfig: {
				uuid: 'b71e6d4dbed84341886e3ee4e9315ee0',
				columns: [
					{id: 'Description', model: 'DescriptionInfo.Description', type: FieldType.Description, label: {text: 'Description', key: 'cloud.common.entityDescription'}, sortable: true, visible: true, readonly: true, width: 200},
				],
			},
			dialogOptions: {
				headerText: 'Procurement Configuration',
				alerts: []
			},
			showDialog: false,
		};

		super(endpoint, gridConfig);
	}
}