/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IPpsProcessSimpleLookupEntity } from '../../model/process-configuration/pps-process-simple-lookup-entity.interface';

/**
 * Process Lookup Service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsProcessCommonLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPpsProcessSimpleLookupEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('Process', {
			uuid: '32ad075094174548a289d60404e0d0e3',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
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
		});
	}
}
