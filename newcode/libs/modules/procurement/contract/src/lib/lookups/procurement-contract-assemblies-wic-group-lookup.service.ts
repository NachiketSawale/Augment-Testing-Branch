/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IDescriptionInfo } from '@libs/platform/common';

interface IBoqItemLookup {
	Reference: string;
	BriefInfo: IDescriptionInfo;
}

@Injectable({
	providedIn: 'root',
})
export class ProcurementContractAssembliesWicGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBoqItemLookup, T> {
	public constructor() {
		super(
			{
				httpRead: { route: 'boq/wic/group/', endPointRead: 'tree' },
				dataProcessors: [],
				filterParam: false,
				tree: {
					parentProp: 'WicGroupFk',
					childProp: 'WicGroups',
				},
			},
			{
				uuid: '49b49742451d430ca63453b7d9d03569',
				valueMember: 'Id',
				displayMember: 'Reference',
				gridConfig: {
					columns: [
						{
							id: 'code',
							model: 'Code',
							type: FieldType.Code,
							label: { text: 'Code', key: 'cloud.common.entityCode' },
							sortable: true,
							visible: true,
							readonly: true,
						},
						{
							id: 'Description',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: { text: 'Description', key: 'cloud.common.entityDescription' },
							sortable: true,
							visible: true,
							readonly: true,
						},
					],
				},
			},
		);
	}
}
