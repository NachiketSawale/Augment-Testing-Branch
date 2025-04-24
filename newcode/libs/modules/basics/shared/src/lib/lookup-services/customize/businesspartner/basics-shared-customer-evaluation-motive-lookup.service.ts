/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCustomerEvaluationMotiveEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCustomerEvaluationMotiveEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCustomerEvaluationMotiveLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCustomerEvaluationMotiveEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/customerevaluationmotive/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd4a35b8d1b7347a39c38fcd044ba8edf',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCustomerEvaluationMotiveEntity) => x.DescriptionInfo),
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
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isgroupa',
						model: 'Isgroupa',
						type: FieldType.Boolean,
						label: { text: 'Isgroupa' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isgroupb',
						model: 'Isgroupb',
						type: FieldType.Boolean,
						label: { text: 'Isgroupb' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isgroupc',
						model: 'Isgroupc',
						type: FieldType.Boolean,
						label: { text: 'Isgroupc' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
