/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { IReportDisplayType } from '../../../model/types/workflow-report-type.type';
import { Injectable } from '@angular/core';

/**
 * Configuration class for entity data action editor.
 */
@Injectable({
	providedIn: 'root'
})
export class EntityDataActionTypeLookupService<T extends object = IReportDisplayType> extends UiCommonLookupItemsDataService<T> {

	public constructor() {
		const items: IReportDisplayType[] = [{
			id: 1,
			value: 'basics.workflow.entityDataAction.create',
			description: 'basics.workflow.entityDataAction.create'
		},{
			id: 2,
			value: 'basics.workflow.entityDataAction.read',
			description: 'basics.workflow.entityDataAction.read'
		},{
			id: 3,
			value: 'basics.workflow.entityDataAction.update',
			description: 'basics.workflow.entityDataAction.update'
		},{
			id: 4,
			value: 'basics.workflow.entityDataAction.delete',
			description: 'basics.workflow.entityDataAction.delete'
		},];
		super(items as T[], {uuid: 'ee9f50d284b64120b367df5d094d0eb5', displayMember: 'description', valueMember: 'id'});
	}
}