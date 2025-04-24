/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';

import { IWizard2GroupEntity } from '../model/entities/wizard-2group-entity.interface';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { BasicsConfigDataService } from '../../modules/services/basics-config-data.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsConfigWizardXGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IWizard2GroupEntity, T> {
	public basicsConfigDataService = inject(BasicsConfigDataService);
	public constructor() {
		super(
			{
				httpRead: { route: 'basics/config/wizard/', endPointRead: 'list', usePostForRead: false },
				filterParam: true,
				prepareListFilter: () => {
					return 'moduleId=' + this.filter();
				},
			},
			{
				uuid: '4bdb368ecad3463bbfbfee67af936854',
				valueMember: 'Id',
				displayMember: 'Name',
				gridConfig: {
					columns: [
						{
							id: 'Name',
							model: 'Name',
							type: FieldType.Description,
							label: { text: 'Wizard', key: 'basics.config.entityWizardParameterName' },
							sortable: true,
							visible: true,
							readonly: true,
						},
					],
				},
			},
		);
	}

	private filter() {
		let moduleId = 0;
		const selected = this.basicsConfigDataService.getSelection()[0];
		if (selected) {
			moduleId = selected.Id as number;
		}
		return moduleId;
	}
}
