/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';
import { EstimateMainWicGroupDataService } from './estimate-main-wic-group-data.service';
import { IBoqItemSimpleEntity } from '@libs/boq/main';
@Injectable({
	providedIn: 'root'
})
export class EstimateMainWicBoqBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IBoqItemSimpleEntity>,IBoqItemSimpleEntity> {
	protected parentService:EstimateMainWicGroupDataService;
	/**
	 * EstimateMainWicBoqBehaviorService constructor
	 */
	public constructor(private dataService: EstimateMainWicGroupDataService) {
			this.parentService = dataService;
	}

	/**
	 * Method to call when a container is created
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IBoqItemSimpleEntity>): void {
		this.customizeToolbar(containerLink);
	}

	/**
	 * Private method to customize the toolbar with additional items
	 * @param containerLink
	 * @private
	 */
	private customizeToolbar(containerLink: IGridContainerLink<IBoqItemSimpleEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
	}

	public onInit(containerLink: IGridContainerLink<IBoqItemSimpleEntity>): void {
		this.parentService.refreshAll();
	}
}