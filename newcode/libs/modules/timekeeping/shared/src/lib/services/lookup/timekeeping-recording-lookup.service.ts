/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IRecordingEntity } from '@libs/timekeeping/interfaces';

/**
 * Recording lookup service
 */
@Injectable({
	providedIn: 'root'
})

export class TimekeepingRecordingLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IRecordingEntity, TEntity> {

	public constructor() {
		super({httpRead: {route:'timekeeping/recording/',endPointRead:'listbycompany'}},
			{
				uuid: '5bde1d26ecdf4d23be13cf97ddfbf0d7',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig:{
					uuid: '5bde1d26ecdf4d23be13cf97ddfbf0d7',
					columns: [
						{
							id: 'code',
							model: 'Code',
							type: FieldType.Code,
							label: {text: 'Code'},
							sortable: true,
							visible: true,
							readonly: true,
							width: 100
						},
						{
							id: 'desc',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: {text: 'Description'},
							sortable: true,
							visible: true,
							readonly: true,
							width: 200
						}
					]
				},
				showGrid:true,
				showDialog: false,

			});


	}

}