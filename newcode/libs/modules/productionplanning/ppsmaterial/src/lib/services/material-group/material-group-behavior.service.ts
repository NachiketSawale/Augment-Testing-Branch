// remark: current file is copied from basics-material-material-group-behavior.service in basics.material, 
// should be replaced by other way(like LazyInjectionToken from basics.material module) in the future
/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { inject, Injectable } from '@angular/core';
import { IMaterialGroupEntity } from '@libs/basics/shared';
import { PpsMaterialGroupDataService } from './material-group-data.service';

/**
 * Material group behavior service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsMaterialGroupBehavior implements IEntityContainerBehavior<IGridContainerLink<IMaterialGroupEntity>, IMaterialGroupEntity> {
	private groupDataService: PpsMaterialGroupDataService;

	/**
	 * The constructor
	 */
	public constructor() {
		this.groupDataService = inject(PpsMaterialGroupDataService);
	}

	/**
	 * This method is invoked right when the container component is being created.
	 * @param containerLink A reference to the facilities of the container.
	 */
	public onCreate(containerLink: IGridContainerLink<IMaterialGroupEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
		this.groupDataService.subScribeEvents();
	}

	/**
	 * This method is invoked right when the container component is being destroyed.
	 * @param containerLink A reference to the facilities of the container.
	 */
	public onDestroy(containerLink: IGridContainerLink<IMaterialGroupEntity>) {
		this.groupDataService.unSubScribeEvents();
	}
}
