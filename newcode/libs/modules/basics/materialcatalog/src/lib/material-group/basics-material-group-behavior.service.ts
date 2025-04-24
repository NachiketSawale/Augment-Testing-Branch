/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { BasicsMaterialGroupDataService } from './basics-material-group-data.service';
import { IMaterialGroupEntity } from '@libs/basics/shared';

export const BASICS_MATERIAL_GROUP_BEHAVIOR_TOKEN = new InjectionToken<BasicsMaterialGroupBehavior>('basicsMaterialGroupBehavior');

@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialGroupBehavior implements IEntityContainerBehavior<IGridContainerLink<IMaterialGroupEntity>, IMaterialGroupEntity> {
	private dataService: BasicsMaterialGroupDataService;

	public constructor() {
		this.dataService = inject(BasicsMaterialGroupDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IMaterialGroupEntity>): void {

	}

}
