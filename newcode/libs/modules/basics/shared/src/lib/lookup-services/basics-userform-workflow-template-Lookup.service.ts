/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBasicUserFormWorkflowTemplateEntity } from './entities/userform-workflow-template-entity.interface';

/**
 * userform workflow template Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsUserformWorkflowTemplateLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBasicUserFormWorkflowTemplateEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super({
			httpRead: { route: 'basics/workflow/template/', endPointRead: 'list' }
		}, {
			uuid: '1359106bb7304855a0ffc10428e3f7a6',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}