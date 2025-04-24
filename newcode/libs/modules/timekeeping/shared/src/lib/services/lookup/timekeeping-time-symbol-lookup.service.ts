/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { BasicsSharedUomLookupService } from '@libs/basics/shared';
import { ITimeSymbolEntity } from '@libs/timekeeping/interfaces';


/**
 * Certificate lookup service
 */
@Injectable({
	providedIn: 'root'
})

export class TimekeepingTimeSymbolLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<ITimeSymbolEntity, TEntity> {
	public constructor() {
		const endpoint = { httpRead: { route: 'timekeeping/timesymbols/', endPointRead: 'listbycontext' } };
		const config: ILookupConfig<ITimeSymbolEntity> = {
			uuid: '8f4f18118748446abbc490b57d68e65c',
			valueMember: 'Id',
			displayMember: 'Code',
			showGrid: true,
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: {text: 'Code', key: 'cloud.common.entityCode'},
						sortable: true,
						visible: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true
					},
					{
						id: 'TimeSymbolGroup',
						model: 'TimeSymbolGroup.DescriptionInfo',
						type: FieldType.Translation,
						label: {text: 'TimeSymbolGroup', key: 'timekeeping.timesymbols.entityTimeSymbolGroupFk'},
						sortable: true,
						visible: true
					},
					{
						id: 'UoMFk',
						model: 'UoMFk',
						label: {text: 'UoM', key: 'timekeeping.timesymbols.entityUomFk'},
						width: 100,
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedUomLookupService
						}),
						sortable: true,
						visible: true
					}
					]
			}
		};
		super(endpoint, config);
	}

}