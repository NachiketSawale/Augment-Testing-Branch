/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IActivityTemplateEntity } from '../model/entities/activity-template-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ActivityTemplateLookupDataService<T extends object> extends UiCommonLookupTypeDataService<IActivityTemplateEntity, T> {

	public constructor() {
		super('schedulingactivitytemplate', {
			uuid: '48a51acf1180442fa493918fee57f8e0',
			displayMember: 'Code',
			valueMember: 'Id'
		});
	}
}
