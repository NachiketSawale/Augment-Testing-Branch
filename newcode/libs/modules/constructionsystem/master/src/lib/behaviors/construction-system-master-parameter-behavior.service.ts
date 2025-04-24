/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ICosParameterEntity } from '@libs/constructionsystem/shared';

export const CONSTRUCTION_SYSTEM_MASTER_PARAMETER_BEHAVIOR_TOKEN = new InjectionToken<ConstructionSystemMasterParameterBehavior>('constructionSystemMasterParameterBehavior');

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameterBehavior implements IEntityContainerBehavior<IGridContainerLink<ICosParameterEntity>, ICosParameterEntity> {
	public onCreate(containerLink: IGridContainerLink<ICosParameterEntity>) {
		//todo-allen: Wait for the framework to finish the button: bulkEditor.
	}
}
