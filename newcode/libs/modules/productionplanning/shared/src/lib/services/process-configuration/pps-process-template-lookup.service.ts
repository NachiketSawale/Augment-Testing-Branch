/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IPpsProcessTemplateSimpleLookupEntity } from '../../model/process-configuration/pps-process-template-simple-lookup-entity.interface';

/**
 * Process Template Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class ProductionplanningSharedProcessTemplateLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPpsProcessTemplateSimpleLookupEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('ProcessTemplate', {
			uuid: '243cbcb1bc814bc1a1925d53eaada698',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			showClearButton: true
		});
	}
}