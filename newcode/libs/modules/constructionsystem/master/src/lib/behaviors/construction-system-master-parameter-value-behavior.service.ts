/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ICosParameterValueEntity } from '@libs/constructionsystem/shared';

export const CONSTRUCTION_SYSTEM_MASTER_PARAMETER_VALUE_BEHAVIOR_TOKEN = new InjectionToken<ConstructionSystemMasterParameterValueBehavior>('constructionSystemMasterParameterValueBehavior');

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameterValueBehavior implements IEntityContainerBehavior<IGridContainerLink<ICosParameterValueEntity>, ICosParameterValueEntity> {
	public onCreate(containerLink: IGridContainerLink<ICosParameterValueEntity>) {
		// todo-allen: Wait for the framework to finish the button: bulkEditor.
	}
}
